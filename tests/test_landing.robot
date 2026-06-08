*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Open Landing Page And Verify Title
    ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${chrome_options}    add_argument    --headless
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    Create Webdriver    Chrome    options=${chrome_options}
    Go To    http://localhost:3000/
    Title Should Be    AIVA - AI Virtual Assistant | ระบบจัดการลูกค้าอัจฉริยะ
    Close Browser
