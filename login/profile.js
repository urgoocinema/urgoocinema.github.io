document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll(".menu .menuButton");
  const componentWrapper = document.querySelector(".componentWrapper");
  const customHeader = document.querySelector("custom-header");
  const userId = "1";

  menuButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const componentName = this.dataset.component;
      if (!componentName) {
        console.warn("Button does not have a data-component attribute:", this);
        return;
      }

      componentWrapper.innerHTML = "";

      menuButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      let newComponentElement;

      switch (componentName) {
        case "AccountOverview":
          newComponentElement = document.createElement("account-overview");
          newComponentElement.setAttribute("user-id","1");
          break;
        case "PersonalDetails":
          newComponentElement = document.createElement("personal-details");
          break;
        case "Reminders":
          newComponentElement = document.createElement("reminders-component");
          break;
        case "Tickets":
          newComponentElement = document.createElement("tickets-component");
          break;
        default:
          console.error("Unknown component:", componentName);
          return;
      }

      if (newComponentElement) {
        componentWrapper.appendChild(newComponentElement);
      }
    });
  });
});
