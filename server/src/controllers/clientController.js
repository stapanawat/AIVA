const prisma = require('../config/db');
const geminiService = require('../services/geminiService');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// 1. Get Dashboard Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;

    // Aggregate stats from the database
    const totalChats = await prisma.chat.count({ where: { clientId } });
    const botHandled = await prisma.chat.count({ where: { clientId, status: 'BOT_HANDLING' } });
    const adminHandled = await prisma.chat.count({ where: { clientId, status: 'ADMIN_HANDLING' } });
    const leadCount = await prisma.lead.count({ where: { clientId } });

    // Calculate mock conversion rate & token percentage
    const conversionRate = totalChats > 0 ? ((leadCount / totalChats) * 100).toFixed(1) : 0;

    res.json({
      totalChats,
      botHandled,
      adminHandled,
      leadCount,
      conversionRate,
      tokensUsed: 42350,
      tokenLimit: 100000
    });
  } catch (error) {
    next(error);
  }
};

// 2. Knowledge Base Operations
const getKnowledgeBase = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const entries = await prisma.knowledge.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

const createKnowledgeEntry = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    let { type, title, sourceUrl, content } = req.body;
    let size = 0;

    // Handle uploaded file
    if (req.file) {
      const file = req.file;
      size = file.size;
      
      // Auto-assign title if not provided
      if (!title || title.trim() === '') {
        title = file.originalname;
      }
      
      const extension = file.originalname.split('.').pop().toLowerCase();
      
      if (extension === 'pdf') {
        try {
          const parsed = await pdfParse(file.buffer);
          content = parsed.text;
        } catch (parseErr) {
          console.error('PDF parsing error:', parseErr);
          return res.status(400).json({ error: 'Failed to parse PDF file. The file may be corrupt or encrypted.' });
        }
      } else if (extension === 'docx' || extension === 'doc') {
        try {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          content = result.value;
        } catch (parseErr) {
          console.error('Word file parsing error:', parseErr);
          return res.status(400).json({ error: 'Failed to parse Word document.' });
        }
      } else if (extension === 'txt') {
        content = file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type. Only PDF, Word, and TXT files are allowed.' });
      }
    }

    if (!type) {
      type = req.file ? 'FILE' : 'TEXT';
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required (or file is empty).' });
    }

    const entry = await prisma.knowledge.create({
      data: {
        clientId,
        type: type.toUpperCase(),
        title,
        sourceUrl: type.toUpperCase() === 'URL' ? sourceUrl : null,
        content,
        fileSize: size || (req.body.fileSize ? parseInt(req.body.fileSize) : 0),
        tokens: Math.ceil(content.length / 4), // Simple token estimate
        status: 'TRAINED'
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// 3. Chat Inbox Operations
const getChats = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const chats = await prisma.chat.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(chats);
  } catch (error) {
    next(error);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    // Note: checkTenantAccess middleware already verified that this chat belongs to req.user.clientId
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const sendChatMessage = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Save admin message
    const message = await prisma.message.create({
      data: {
        chatId,
        sender: 'AGENT',
        content
      }
    });

    // Update chat status to ADMIN_HANDLING and update timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        status: 'ADMIN_HANDLING',
        updatedAt: new Date()
      }
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// 4. CRM Pipeline Operations
const getLeads = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const leads = await prisma.lead.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

const createOrUpdateLead = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { id, name, contact, intent, value, stage } = req.body;

    if (id) {
      // Update existing lead
      // Validate tenant-level authorization
      const existingLead = await prisma.lead.findUnique({
        where: { id }
      });

      if (!existingLead || existingLead.clientId !== clientId) {
        return res.status(403).json({ error: 'Access denied. Lead does not belong to this tenant.' });
      }

      const updatedLead = await prisma.lead.update({
        where: { id },
        data: {
          name,
          contact,
          intent,
          value: value !== undefined ? parseFloat(value) : undefined,
          stage,
          updatedAt: new Date()
        }
      });
      return res.json(updatedLead);
    } else {
      // Create new lead
      if (!name || !contact) {
        return res.status(400).json({ error: 'Name and contact are required.' });
      }

      const newLead = await prisma.lead.create({
        data: {
          clientId,
          name,
          contact,
          intent,
          value: value !== undefined ? parseFloat(value) : 0,
          stage: stage || 'NEW'
        }
      });
      return res.status(201).json(newLead);
    }
  } catch (error) {
    next(error);
  }
};

// 5. Team Operations
const getTeamMembers = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const team = await prisma.teamMember.findMany({
      where: { clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true
          }
        }
      }
    });

    const formattedTeam = team.map(member => ({
      id: member.id,
      userId: member.user.id,
      email: member.user.email,
      name: member.user.name,
      role: member.role,
      status: member.user.status,
      createdAt: member.createdAt
    }));

    res.json(formattedTeam);
  } catch (error) {
    next(error);
  }
};

const inviteTeamMember = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { email, name, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required.' });
    }

    // 1. Get client details to check active subscription plan limits
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    const plan = client ? client.plan : 'BASIC';
    const maxUsers = plan === 'BASIC' ? 1 : plan === 'PRO' ? 5 : 20;

    // 2. Count current team members
    const currentMemberCount = await prisma.teamMember.count({
      where: { clientId }
    });

    // 3. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    let isAlreadyMember = false;
    if (user) {
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          clientId_userId: {
            clientId,
            userId: user.id
          }
        }
      });
      if (existingMember) {
        isAlreadyMember = true;
      }
    }

    // 4. Enforce plan limit if adding a new member
    if (!isAlreadyMember && currentMemberCount >= maxUsers) {
      return res.status(403).json({
        error: `ขออภัยค่ะ คุณใช้โควต้าพนักงานในทีมเต็มแล้วสำหรับแพ็กเกจ ${plan} (สูงสุด ${maxUsers} คน) กรุณาอัปเกรดแพ็กเกจเพื่อเพิ่มสมาชิกเพิ่มค่ะ`
      });
    }

    if (!user) {
      // Create mock user if they don't exist
      // In production, we'd send an email invite. Here we auto-create with a mock password.
      const mockPasswordHash = '$2a$10$wMhBqVly17m1h.W4c4x/..Mv.8g6qFz/qV31.v.P88942.' // bcrypt 'password'
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: mockPasswordHash,
          name,
          role: 'CLIENT_STAFF'
        }
      });
    }

    // Check if already in this team
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        clientId_userId: {
          clientId,
          userId: user.id
        }
      }
    });

    if (existingMember) {
      return res.status(200).json({
        id: existingMember.id,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: existingMember.role,
        status: user.status,
        createdAt: existingMember.createdAt
      });
    }

    const newMember = await prisma.teamMember.create({
      data: {
        clientId,
        userId: user.id,
        role: role || 'STAFF'
      },
      include: {
        user: true
      }
    });

    res.status(201).json({
      id: newMember.id,
      userId: newMember.user.id,
      email: newMember.user.email,
      name: newMember.user.name,
      role: newMember.role,
      status: newMember.user.status,
      createdAt: newMember.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// 6. Settings Operations
const updateSettings = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { brandName, aiName, aiPersona, customPrompt, notifyHotLead, notifyDailyReport, bossName } = req.body;

    if (!brandName) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }

    if (bossName) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name: bossName }
      });
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: brandName,
        aiName,
        aiPersona,
        customPrompt,
        notifyHotLead: notifyHotLead !== undefined ? !!notifyHotLead : undefined,
        notifyDailyReport: notifyDailyReport !== undefined ? !!notifyDailyReport : undefined,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Settings saved successfully!',
      client: updatedClient
    });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// 7. AI Content Creator
const generateAIContent = async (req, res, next) => {
  try {
    const { prompt, platform } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    const result = await geminiService.generateMarketingCopy(prompt, platform || 'Facebook');
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// 8. Branch Management Operations
const getBranches = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const branches = await prisma.branch.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(branches);
  } catch (error) {
    next(error);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { name, manager, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Branch name is required.' });
    }

    const branch = await prisma.branch.create({
      data: {
        clientId,
        name,
        managerName: manager || 'ไม่มีผู้จัดการ',
        status: status || 'Active'
      }
    });

    res.status(201).json(branch);
  } catch (error) {
    next(error);
  }
};

// 9. Follow-Up Rules Operations
const getFollowUpRules = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const rules = await prisma.followUpRule.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rules);
  } catch (error) {
    next(error);
  }
};

const createFollowUpRule = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { name, delay, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Rule name and message are required.' });
    }

    const rule = await prisma.followUpRule.create({
      data: {
        clientId,
        name,
        delay: delay || '24h',
        message,
        active: true
      }
    });

    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

const toggleFollowUpRule = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const ruleId = req.params.id;

    const existingRule = await prisma.followUpRule.findUnique({
      where: { id: ruleId }
    });

    if (!existingRule || existingRule.clientId !== clientId) {
      return res.status(404).json({ error: 'Rule not found or access denied.' });
    }

    const updatedRule = await prisma.followUpRule.update({
      where: { id: ruleId },
      data: {
        active: !existingRule.active
      }
    });

    res.json(updatedRule);
  } catch (error) {
    next(error);
  }
};

// 10. Feedback Operations
const getFeedbacks = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const feedbacks = await prisma.feedback.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { type, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        clientId,
        type: type || 'bug',
        title,
        description,
        status: 'Pending'
      }
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getKnowledgeBase,
  createKnowledgeEntry,
  getChats,
  getChatMessages,
  sendChatMessage,
  getLeads,
  createOrUpdateLead,
  getTeamMembers,
  inviteTeamMember,
  updateSettings,
  getSettings,
  generateAIContent,
  getBranches,
  createBranch,
  getFollowUpRules,
  createFollowUpRule,
  toggleFollowUpRule,
  getFeedbacks,
  createFeedback
};
