package y;

import org.junit.experimental.categories.Category;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

@Category(IntegrationTest.class)
public class NewTest  {
        public void testBrowser() {
        HtmlUnitDriver driver = new HtmlUnitDriver();
        driver.get("http://www.google.com/webhp?complete=1&hl=en");
        WebElement query = driver.findElement(By.name("q"));
        }
}
