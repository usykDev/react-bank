class Form extends React.Component {
  FIELD_NAME = {};
  FIELD_ERROR = {};

  value = {};
  error = {};
  disabled = true;

  change = (name, value) => {
    const error = this.validate(name, value);
    this.value[name] = value;

    if (error) {
      this.setError(name, error);
      this.error[name] = error;
    } else {
      this.setError(name, null);
      delete this.error[name];
    }

    this.checkDisabled();
    this.validateAll();
  };

  setError = (name, error) => {
    const span = document.querySelector(`.form__error[name="${name}"]`);

    const field = document.querySelector(`.validation[name="${name}"]`);

    if (span) {
      span.classList.toggle("form__error--active", Boolean(error));
      span.innerText = error || "";
    }

    if (field) {
      field.classList.toggle("validation--active", Boolean(error));
    }
  };

  checkDisabled = () => {
    let disabled = false;

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (this.error[name] || this.value[name] === undefined) {
        disabled = true;
      }
    });

    const el = document.querySelector(`.button`);

    if (el) {
      const isDisabled = Boolean(disabled);
      const alert = document.querySelector(`.alert`);

      el.classList.toggle("button--disabled", isDisabled);

      if (isDisabled) {
        el.setAttribute("disabled", "true");
      } else {
        el.removeAttribute("disabled");
        alert.className = "alert alert--disabled";
      }
    }

    const stripeCard = document.getElementById("stripeCard");
    const coinCard = document.getElementById("coinCard");

    if (stripeCard && coinCard) {
      const isDisabled = Boolean(disabled);
      const alert = document.querySelector(`.alert`);

      stripeCard.classList.toggle("card--disabled", isDisabled);
      coinCard.classList.toggle("card--disabled", isDisabled);

      if (isDisabled) {
        stripeCard.setAttribute("disabled", "true");
        coinCard.setAttribute("disabled", "true");
      } else {
        stripeCard.removeAttribute("disabled");
        coinCard.removeAttribute("disabled");
        alert.className = "alert alert--disabled";
      }
    }

    this.disabled = disabled;
  };

  validateAll = () => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name]);

      if (error) {
        this.setError(name, error);
      }
    });
  };

  setAlert = (status, text) => {
    const el = document.querySelector(`.alert`);

    if (status === "progress") {
      el.className = "alert alert--progress";
    } else if (status === "success") {
      el.className = "alert alert--success";
    } else if (status === "error") {
      el.className = "alert alert--error";
    } else {
      el.className = "alert alert--disabled";
    }

    if (text) el.innerText = text; /// ?????
  };
}
