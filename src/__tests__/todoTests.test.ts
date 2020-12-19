import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";

const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
  todoInput: By = By.className("new-todo");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label"); 
  todoComplete: By = By.css("input");
  clearCompletedButton: By = By.css("button.clear-completed");
  todoStar: By = By.className("star");
  starBanner: By = By.className("starred");
  todoCount: By = By.className("todo-count");

  driver: WebDriver;

  
  url: string = "https://devmountain.github.io/qa_todos/";

  
  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}

const todopage = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(todopage.url);
  });
  afterAll(async () => {
    await driver.quit();
  });
  it("can add a todo", async () => {
    await driver.wait(until.elementLocated(todopage.todoInput));
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do\n");
  });
  it("can remove a todo", async () => {
    let myTodos = await driver.findElements(todopage.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(todopage.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(todopage.todoComplete)
      .click();
    await (await driver.findElement(todopage.clearCompletedButton)).click();
    myTodos = await driver.findElements(todopage.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(todopage.todoLabel)).getText()) == "Test To-Do";
    });
    expect(myTodo.length).toEqual(0);
  });
  it("can mark a todo with a star", async () => {
    await driver.wait(until.elementLocated(todopage.todoInput));
    let startingStars = await (await driver.findElements(todopage.starBanner)).length;

    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do\n");
    await (await driver.findElements(todopage.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(todopage.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(todopage.todoStar)
      .click();
    let endingStars = await (await driver.findElements(todopage.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("has the right number of todos listed", async () => {
    await driver.wait(until.elementLocated(todopage.todoInput));

    let startingTodoCount = await (await driver.findElements(todopage.todos)).length;

    
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do 1\n");
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do 2\n");
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do 3\n");
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do 4\n");
    await driver.findElement(todopage.todoInput).sendKeys("Test To-Do 5\n");

    let endingTodoCount = await (await driver.findElements(todopage.todos)).length;

    let message = await (await driver.findElement(todopage.todoCount)).getText();

    expect(endingTodoCount - startingTodoCount).toBe(5);
    expect(message).toBe(`${endingTodoCount} items left`);
  });
});
