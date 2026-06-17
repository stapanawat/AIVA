*** Settings ***
Library          SeleniumLibrary
Test Setup       Open Browser To Landing Page
Test Teardown    Close All Browsers

*** Variables ***
${URL}              http://localhost:3000/
${BROWSER}          Chrome
${DELAY}            0.2s

*** Keywords ***
Open Browser To Landing Page
    ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${chrome_options}    add_argument    --headless
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    Create Webdriver    Chrome    options=${chrome_options}
    Set Selenium Speed    ${DELAY}
    Set Window Size    1920    1080
    Go To    ${URL}

Navigate To Portal
    [Arguments]    ${portal_name}
    Wait Until Element Is Visible    xpath=//button[contains(., '${portal_name}')]    timeout=10s
    Click Element    xpath=//button[contains(., '${portal_name}')]
    Sleep    1s

Wait For Dashboard Status Banner
    Wait Until Keyword Succeeds    15s    0.5s    Verify Dashboard Status Banner

Verify Dashboard Status Banner
    ${ready}=    Run Keyword And Return Status    Page Should Contain    AIVA Agent ของคุณพร้อมทำงานแล้ว!
    IF    ${ready}    RETURN
    Page Should Contain    AIVA เชื่อมต่อช่องทางสำเร็จแล้ว!


*** Test Cases ***
Scenario 1: Landing Page Billing Switcher & Checkout Integration
    [Tags]    e2e    landing
    # Check default price is Basic (฿990/เดือน)
    Wait Until Page Contains    990    timeout=10s
    
    # Click Yearly pricing
    Click Element    id=btn-yearly
    Wait Until Page Contains    10,098    timeout=5s
    
    # Click Monthly pricing back
    Click Element    id=btn-monthly
    Wait Until Page Contains    990    timeout=5s
    
    # Click Select Package Pro button (the second select package button)
    Click Element    id=btn-select-pro
    
    # Verify checkout summary loads Pro values
    Wait Until Page Contains    AIVA Pro Plan    timeout=5s
    Wait Until Page Contains    5,243.00    timeout=5s
    
    # Click Tax type corporate
    Click Element    id=btn-tax-corporate
    Wait Until Element Is Visible    id=branch-field    timeout=5s
    
    # Click PromptPay tab
    Click Element    id=tab-promptpay
    Wait Until Element Is Visible    id=form-promptpay    timeout=5s
    Wait Until Page Contains    5,243.00    timeout=5s
    
    # Click Card tab
    Click Element    id=tab-card
    
    # Fill in checkout details
    ${rand}=    Evaluate    random.randint(100000, 999999)    random
    Input Text    id=input-name    บริษัท ทดสอบ จำกัด
    Input Text    id=input-email    testclient_${rand}@aiva.com
    Input Text    id=input-tax-id    1234567890123
    Input Text    id=input-address    123/45 ถนนพัฒนาการ เขตสวนหลวง กรุงเทพมหานคร 10250
    
    # Mock checkout fetch response to prevent Stripe redirect on live site
    Execute Javascript    window.fetch = (function(orig) { return async function(...args) { if (args[0] === '/api/payments/checkout') { const r = await orig.apply(this, args); if (r.ok) { const d = await r.json(); return new Response(JSON.stringify(Object.assign({}, d, {url: ""})), {status: r.status, headers: r.headers}); } } return orig.apply(this, args); }; })(window.fetch);

    # Pay
    Click Element    id=btn-pay-card
    Sleep    3s
    Wait Until Element Is Visible    id=btn-goto-platform    timeout=30s
    
    # Click Go to Platform
    Click Element    id=btn-goto-platform
    
    # Should land on Platform dashboard directly (auto-logged in after registration)
    Wait Until Page Contains    OWNER    timeout=20s

Scenario 2: Client Platform Dashboard & Management Features
    [Tags]    feature    platform
    Navigate To Portal    Client Platform
    
    # We should see Platform Login (mock email admin@globaltech.com)
    Wait Until Page Contains    เข้าสู่ระบบการจัดการ    timeout=5s
    Input Text    xpath=(//input[@type='email'])[1]    admin@globaltech.com
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'เข้าสู่ระบบ AIVA Platform')]
    
    # Wait for dashboard to load
    Wait Until Page Contains    ภาพรวม    timeout=10s
    Wait For Dashboard Status Banner
    
    # Switch to "สอน AIVA" (Knowledge Base)
    Click Element    xpath=//*[contains(text(), 'สอน AIVA')]
    Wait Until Page Contains    รายการข้อมูลในสมอง AI    timeout=5s
    
    # Switch to "จัดการทีม" (Team Management)
    Click Element    id=btn-nav-team
    Wait Until Page Contains    รายชื่อทีม    timeout=5s
    
    # Add new team member
    Click Element    xpath=//button[contains(., 'เพิ่มสมาชิก')]
    Page Should Contain    เพิ่มสมาชิกในทีม
    Input Text    xpath=//input[@placeholder='เช่น น้องพลอย แอดมิน']    น้องมะลิ แอดมิน
    Input Text    xpath=//input[@placeholder='ploy@example.com']    mali@example.com
    Click Element    xpath=//button[contains(., 'ส่งคำเชิญ')]
    
    # Check that new team member was added to list
    Wait Until Page Contains    น้องมะลิ แอดมิน    timeout=10s
    Wait Until Page Contains    mali@example.com    timeout=5s
    
    # Cycle Language
    Page Should Contain    จัดการทีม
    Click Element    xpath=//button[@title='Change Language']
    Page Should Contain    Team
    Click Element    xpath=//button[@title='Change Language']
    Page Should Contain    团队
    
    # Cycle back to Thai
    Click Element    xpath=//button[@title='Change Language']
    Page Should Contain    จัดการทีม
    
    # Toggle Dark Mode
    Click Element    id=btn-toggle-dark
    
    # Navigate to Settings and logout
    Click Element    id=btn-nav-settings
    Wait Until Page Contains    ตั้งค่าระบบ    timeout=5s
    Click Element    id=btn-logout-platform
    Wait Until Page Contains    เข้าสู่ระบบการจัดการ    timeout=5s

Scenario 3: Partner Portal Referral and Registration Workflow
    [Tags]    feature    partner
    Navigate To Portal    Partner Portal
    
    # See Partner Login
    Page Should Contain    เข้าสู่ระบบพาร์ทเนอร์
    Input Text    xpath=(//input[@type='text'])[1]    P88942
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'ลงชื่อเข้าใช้')]
    
    # Verify Partner Dashboard (waits for mock 800ms loading timeout)
    Wait Until Page Contains    สมชาย ใจดี    timeout=10s
    Page Should Contain    18%
    
    # Switch to เครือข่ายตัวแทน tab
    Click Element    xpath=//*[contains(text(), 'เครือข่ายตัวแทน')]
    Wait Until Page Contains    สร้างลิงก์เชิญ    timeout=5s
    
    # Click create invite link for Sub-Partner
    Click Element    xpath=//button[contains(., 'สร้างลิงก์เชิญ')]
    Wait Until Page Contains    สร้างลิงก์สมัคร Sub-Partner    timeout=5s
    Page Should Contain    https://aiva.sparexth.com/apply?ref=P88942
    
    # Close invite modal by X button
    Click Element    xpath=//h2[contains(., 'สร้างลิงก์สมัคร')]/following-sibling::button
    
    # Logout
    Click Element    xpath=//button[@title='Logout']
    Wait Until Page Contains    เข้าสู่ระบบพาร์ทเนอร์    timeout=5s

Scenario 4: Super Admin Portal KYC Approval and Partner Center
    [Tags]    feature    admin
    Navigate To Portal    Super Admin
    
    # See Super Admin Login
    Page Should Contain    SuperAdmin
    Page Should Contain    Admin ID
    Input Text    xpath=(//input[@type='text'])[1]    ROOT-01
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'Authorize Access')]
    
    # Verify Super Admin dashboard loads (waits for mock 600ms loading timeout)
    Wait Until Page Contains    Partners    timeout=10s
    
    # Switch to Announcements tab
    Click Element    xpath=//*[contains(text(), 'ประกาศ & แคมเปญ')]
    Wait Until Page Contains    Broadcast    timeout=5s
    
    # Switch back to Partners and verify listing
    Click Element    xpath=//*[contains(text(), 'พาร์ทเนอร์ (Partners)')]
    Wait Until Page Contains    P88942    timeout=5s
    Page Should Contain    P11223
    
    # Logout
    Click Element    xpath=//p[contains(., 'System Logout')]
    Wait Until Page Contains    SuperAdmin    timeout=5s

Scenario 5: Super Admin SMTP Configuration and Connection Test
    [Tags]    feature    admin    smtp
    Navigate To Portal    Super Admin
    
    # Login to Super Admin
    Wait Until Page Contains    SuperAdmin    timeout=5s
    Input Text    xpath=(//input[@type='text'])[1]    ROOT-01
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'Authorize Access')]
    
    # Wait for dashboard to load
    Wait Until Page Contains    Partners    timeout=10s
    
    # Click SMTP Settings tab
    Wait Until Element Is Visible    id=btn-nav-smtp    timeout=10s
    Click Element    id=btn-nav-smtp
    
    # Wait to ensure background fetch resolves and stabilizes the state
    Sleep    5s
    
    # Verify SMTP fields are visible
    Wait Until Element Is Visible    id=smtp-host    timeout=10s
    Wait Until Element Is Visible    id=smtp-port    timeout=10s
    Wait Until Element Is Visible    id=smtp-user    timeout=10s
    Wait Until Element Is Visible    id=smtp-pass    timeout=10s
    Wait Until Element Is Visible    id=smtp-from    timeout=10s
    
    # Input SMTP settings
    Input Text    id=smtp-host    smtp.ethereal.email
    Input Text    id=smtp-port    587
    Input Text    id=smtp-user    test_admin@ethereal.email
    Input Text    id=smtp-pass    test_password123
    Input Text    id=smtp-from    test_admin@ethereal.email
    
    # Save settings
    Click Element    id=btn-save-smtp
    Wait Until Page Contains    บันทึกการตั้งค่า SMTP สำเร็จแล้วค่ะ!    timeout=20s
    
    # Input test recipient and test connection
    Input Text    id=smtp-test-email    recipient@gmail.com
    Click Element    id=btn-test-smtp
    Wait Until Page Contains    ส่งอีเมลทดสอบไปยัง recipient@gmail.com สำเร็จแล้วค่ะ!    timeout=25s
    
    # Logout
    Click Element    xpath=//p[contains(., 'System Logout')]
    Wait Until Page Contains    SuperAdmin    timeout=5s

Scenario 6: Client Platform AI Chat Bullets & Knowledge Deletion
    [Tags]    feature    platform    knowledge    chat
    Navigate To Portal    Client Platform
    
    # Login to Client Platform
    Wait Until Page Contains    เข้าสู่ระบบการจัดการ    timeout=5s
    Input Text    xpath=(//input[@type='email'])[1]    admin@globaltech.com
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'เข้าสู่ระบบ AIVA Platform')]
    
    # Wait for dashboard to load
    Wait Until Page Contains    ภาพรวม    timeout=10s
    Wait For Dashboard Status Banner
    
    # Go to "สอน AIVA" (Knowledge Base)
    Click Element    id=btn-nav-knowledge
    Wait Until Page Contains    รายการข้อมูลในสมอง AI    timeout=5s
    
    # Generate random suffix
    ${rand}=    Evaluate    random.randint(100000, 999999)    random
    
    # Add new text knowledge item
    Click Element    xpath=//button[contains(., 'พิมพ์ข้อความโดยตรง (Text)')]
    Wait Until Element Is Visible    id=input-knowledge-title    timeout=5s
    Input Text    id=input-knowledge-title    นโยบายการคืนสินค้า_${rand}
    Input Text    id=input-knowledge-content    - คืนสินค้าได้ภายใน 7 วัน\n- สินค้าต้องไม่ผ่านการใช้งาน\n* ต้องมีใบเสร็จรับเงิน
    Click Button    id=btn-save-knowledge
    
    # Verify the new item is listed
    Wait Until Page Contains    นโยบายการคืนสินค้า_${rand}    timeout=5s
    
    # Mock window.confirm to auto-approve deletion
    Execute Javascript    window.confirm = function() { return true; }
    
    # Delete the new item
    Wait Until Element Is Visible    xpath=//span[contains(text(), 'นโยบายการคืนสินค้า_${rand}')]/ancestor::tr//button[contains(@class, 'btn-delete-knowledge')]    timeout=5s
    Click Element    xpath=//span[contains(text(), 'นโยบายการคืนสินค้า_${rand}')]/ancestor::tr//button[contains(@class, 'btn-delete-knowledge')]
    
    # Verify deletion message/removal
    Wait Until Page Contains    ลบข้อมูลสำเร็จแล้ว    timeout=5s
    Wait Until Page Does Not Contain    นโยบายการคืนสินค้า_${rand}    timeout=5s
    
    # Go to "AIVA Inbox & Chat"
    Click Element    id=btn-nav-inbox
    Wait Until Page Contains    AIVA Inbox & Chat    timeout=5s
    
    # Click on the first chat (Khun Praew (VIP))
    Wait Until Element Is Visible    xpath=//*[contains(text(), 'Khun Praew (VIP)')]    timeout=5s
    Click Element    xpath=//*[contains(text(), 'Khun Praew (VIP)')]
    
    # Verify bullet point message renders correctly in HTML structure
    Wait Until Element Is Visible    xpath=//ul[contains(@class, 'list-disc')]/li    timeout=5s
    Page Should Contain Element    xpath=//ul[contains(@class, 'list-disc')]/li/strong[contains(text(), 'วัสดุ')]
    Page Should Contain Element    xpath=//ul[contains(@class, 'list-disc')]/li/strong[contains(text(), 'สไตล์')]
    Page Should Contain Element    xpath=//ul[contains(@class, 'list-disc')]/li/strong[contains(text(), 'การจัดส่ง')]
    Page Should Contain Element    xpath=//ul[contains(@class, 'list-disc')]/li/strong[contains(text(), 'การรับประกัน')]
    
    # Logout
    Click Element    id=btn-nav-settings
    Wait Until Page Contains    ตั้งค่าระบบ    timeout=5s
    Click Element    id=btn-logout-platform
    Wait Until Page Contains    เข้าสู่ระบบการจัดการ    timeout=5s


