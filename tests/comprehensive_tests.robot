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
    Click Element    xpath=//button[contains(., '${portal_name}')]
    Sleep    1s

*** Test Cases ***
Scenario 1: Landing Page Billing Switcher & Checkout Integration
    [Tags]    e2e    landing
    # Check default price is Basic (฿990/เดือน)
    Page Should Contain    ฿990
    
    # Click Yearly pricing
    Click Element    id=btn-yearly
    Page Should Contain    ฿10,098
    
    # Click Monthly pricing back
    Click Element    id=btn-monthly
    Page Should Contain    ฿990
    
    # Click Select Package Pro button (the second select package button)
    Click Element    id=btn-select-pro
    
    # Verify checkout summary loads Pro values
    Page Should Contain    AIVA Pro Plan
    Page Should Contain    ฿5,243.00
    
    # Click Tax type corporate
    Click Element    id=btn-tax-corporate
    Element Should Be Visible    id=branch-field
    
    # Click PromptPay tab
    Click Element    id=tab-promptpay
    Element Should Be Visible    id=form-promptpay
    Page Should Contain    ฿5,243.00
    
    # Click Card tab
    Click Element    id=tab-card
    
    # Pay
    Click Element    id=btn-pay-card
    Page Should Contain    กำลังประมวลผล...
    Sleep    3s
    Page Should Contain    ชำระเงินสำเร็จ!
    
    # Click Go to Platform
    Click Element    xpath=//button[contains(., 'เข้าสู่ระบบ AIVA Platform')]
    
    # We should see Platform Login (mock email admin@globaltech.com)
    Wait Until Page Contains    เข้าสู่ระบบการจัดการ    timeout=5s
    Input Text    xpath=(//input[@type='email'])[1]    admin@globaltech.com
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'เข้าสู่ระบบ AIVA Platform')]
    
    # Should land on Platform dashboard
    Wait Until Page Contains    AIVA Agent ของคุณพร้อมทำงานแล้ว!    timeout=5s

Scenario 2: Client Platform Dashboard & Management Features
    [Tags]    feature    platform
    Navigate To Portal    Client Platform
    
    # We should see Platform Login (mock email admin@globaltech.com)
    Page Should Contain    เข้าสู่ระบบการจัดการ
    Input Text    xpath=(//input[@type='email'])[1]    admin@globaltech.com
    Input Text    xpath=(//input[@type='password'])[1]    password
    Click Element    xpath=//button[contains(., 'เข้าสู่ระบบ AIVA Platform')]
    
    # Check Dashboard loads
    Wait Until Page Contains    AIVA Agent ของคุณพร้อมทำงานแล้ว!    timeout=5s
    Page Should Contain    ภาพรวม
    
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
    Page Should Contain    น้องมะลิ แอดมิน
    Page Should Contain    mali@example.com
    
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
    Wait Until Page Contains    คุณสมชาย ใจดี    timeout=5s
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
    Wait Until Page Contains    Partner Management    timeout=5s
    Page Should Contain    ประกาศ & แคมเปญ
    
    # Switch to Announcements tab
    Click Element    xpath=//*[contains(text(), 'ประกาศ & แคมเปญ')]
    Wait Until Page Contains    ระบบบรอดแคสต์    timeout=5s
    
    # Switch back to Partners and verify listing
    Click Element    xpath=//*[contains(text(), 'พาร์ทเนอร์ (Partners)')]
    Wait Until Page Contains    สมชาย ใจดี    timeout=5s
    Page Should Contain    บจก. มาร์เก็ตติ้ง จำกัด
    
    # Logout
    Click Element    xpath=//p[contains(., 'System Logout')]
    Wait Until Page Contains    SuperAdmin    timeout=5s
