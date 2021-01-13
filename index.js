const { setImmediate } = require("async");
const { Builder, By, Key, until } = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const cred = require("./accounts.json");
let options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--window-size=1920,1080");
options.addArguments("--start-maximized");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

//HEROKU VERSION
let resend;
let lastMessage;
let errCtr;
let driver = new webdriver.Builder().forBrowser("chrome").setChromeOptions(options).build();

  
  start();


  function start() {
    (async () => {
        try {
            
            await driver.get("https://www.messenger.com");
            await driver.sleep(3000)
            await driver.findElement(By.xpath('//*[@id="email"]')).sendKeys(cred.email);
            await driver.findElement(By.xpath('//*[@id="pass"]')).sendKeys(cred.password);
            await driver.findElement(By.xpath('//*[@id="loginbutton"]')).click();   
            await driver.get("https://www.messenger.com/t/106882174524725");
            await driver.sleep(3000)

            startResendTimer();   
            await timeout(); 
            while (true){
                await checkNewMessage();   
            }
            
            
        }
        catch (e) {
                console.log("Main Process error" + e);  
                process.exit();
        }
    })();
}

async function checkNewMessage() { 
    try {
        await driver.wait(until.elementLocated(By.xpath('//div[@data-testid="incoming_group"][last()]')), 30000)
        msg = await driver.findElement(By.xpath('//div[@data-testid="incoming_group"][last()]')).getText();
        if (msg != lastMessage){
            console.log(msg)
            check(msg);
            lastMessage = msg;
            errCtr = 0;
            
        }
         
    } catch (e) { 
        if (e instanceof webdriver.error.NoSuchElementError){
            console.log("Error getting last message..." + e )
            errCtr++;
            if (errCtr == 20){
                timeout();
            }
        }
        else if (e instanceof webdriver.error.NoSuchSessionError) {
            await driver.quit();
            process.exit();    
        }
        else {
            console.log(e)
            //process.exit();    
        }
    }
    
    //process.nextTick(checkNewMessage);
        
}     

async function timeout(){
  try{
    await driver.findElement(By.xpath('//div[@aria-label="Open persistent menu"]')).click();
    await driver.wait(until.elementLocated(By.xpath("//span[text()='🎖️ STARTER ACCOUNT']")), 30000)
    await driver.findElement(By.xpath("//span[text()='🎖️ STARTER ACCOUNT']")).click();
  } catch (e){
      console.log("Error Clicking Open persistent menu" + e);
  }   
}


function check(message){
    (async () => {
        try{
            if (message.includes("Please type the captcha provided below to verify that you are human and not a robot")) 
            {
                message = message.replace(/[^\x00-\x7F]/g, "");
                message = message.split("\n");
                await driver.findElement(By.className('_1mf _1mj')).sendKeys(message[4], Key.ENTER);  
            }
            else if (message.includes("PROCEED")) {
                
                await driver.findElement(By.className('_1mf _1mj')).sendKeys("PROCEED", Key.ENTER);  
            }
            else if (message.includes("Continue")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Continue']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Continue']"))).click();
            }
            else if (message.includes("It's your lucky day! ")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='⛔ NO THANKS']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='⛔ NO THANKS']"))).click();
            }
            // QUESTIONS
            else if (message.includes("What were ships never used for?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Testing power solar']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Testing power solar']"))).click();
            }
            else if (message.includes("What is the tall upright post called?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Mast']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Mast']"))).click();
            }
            else if (message.includes("What kind of machine is a ship?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='A vehicle']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='A vehicle']"))).click();
            }
            else if (message.includes("How were the ships powered 100 years ago?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Steam powered']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Steam powered']"))).click();
            }
            else if (message.includes("Which surface does ship travel?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Water']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Water']"))).click();
            }
            else if (message.includes("How the ships are constructed?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Naval architecture']")), 4000)
                await driver.findElement(By.xpath("//span[text()='Naval architecture']")).click();
            }
            else if (message.includes("What is the life expectancy of a ship?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='20-30 years']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='20-30 years']"))).click();
            }
            else if (message.includes("What is the name of the minimum water depth a ship can safely navigate in?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Draft']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Draft']"))).click();
            }
            else if (message.includes("What is the difference between ships and boats?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='No distinction']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='No distinction']"))).click();
            }
            else if (message.includes("Where are ships usually constructed?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Shipyard']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Shipyard']"))).click();
            }
            //BAR
            else if (message.includes("When checking someones ID it is ok to ask them to remove it from there wallet")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='True']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='True']"))).click();
            }
            else if (message.includes("When picking up glasses its ok to hold them at the rim.")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='False']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='False']"))).click();
            }
            else if (message.includes("What is the legal drinking age in virginia?")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='21']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='21']"))).click();
            }
            else if (message.includes("If a guest is not 21 but they are with a parent who gives them permission to drink alcohol it is ok to serve them.")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='False']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='False']"))).click();
            }
            else if (message.includes("What is not considered a valid form of ID")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='College ID']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='College ID']"))).click();
            }
            else if (message.includes("If a guest is intoxicated it is not your problem you dont have to worry about calling them a cab or notifying security")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='False']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='False']"))).click();
            }
            else if (message.includes("When picking up drinks from the bar never remove a drink without its drink ticket. Always stab your drink tickets when you have recieved your drink.")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='True']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='True']"))).click();
            }
            else if (message.includes("If you do come across a fake id you should always")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='Give ID to authority']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='Give ID to authority']"))).click();
            }
            else if (message.includes("When taking drink orders and serving drinks you always serve women first.")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='True']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='True']"))).click();
            }
            else if (message.includes("When cutting off alcohol service you should always tell a manager or supervisor")) {
                await driver.wait(until.elementLocated(By.xpath("//span[text()='True']")), 4000)
                await (await driver.findElement(By.xpath("//span[text()='True']"))).click();
            }
            //Dashboard
            else if (message.includes("DASHBOARD")){
                await driver.wait(until.elementLocated(By.xpath('(//div[@aria-label="CONTINUE"])[4]')), 30000)
                await driver.findElement(By.xpath('(//div[@aria-label="CONTINUE"])[4]')).click();
                await driver.get("https://www.messenger.com/t/106882174524725");
            }
            clearResendTimer();
        } catch (e){
            console.log(e);
        } 
    })();
 }

function startResendTimer() {
    resend = setInterval(function() {
      console.log("Reply Timeout");
      timeout();
    }, 90000); 
  }
function clearResendTimer() {
        clearInterval(resend);
        startResendTimer();
 }
