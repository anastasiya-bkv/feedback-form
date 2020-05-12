import React, { Component } from "react";
import "./Form.css";

function validateEmail(email) {
  const reg = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
  return reg.test(String(email).toLowerCase());
}

class Form extends Component {
  state = {
    isFormValid: false,
    /* typeMessageOptions: ["Предложение", "Обращение", "Отзыв"], */
    formControls: {
      firstName: {
        value: "",
        type: "text",
        label: "Имя",
        errorMessage: "Введите имя или фамилию",
        valid: false,
        touched: false,
        validation: {
          required: false,
          or: ["lastName"],
        },
      },
      lastName: {
        value: "",
        type: "text",
        label: "Фамилия",
        errorMessage: "Введите имя или фамилию",
        valid: false,
        touched: false,
        validation: {
          required: false,
          or: ["firstName"],
        },
      },
      email: {
        value: "test@test.test",
        type: "email",
        label: "Email",
        errorMessage: "Введите корректный email",
        valid: false,
        touched: false,
        validation: {
          required: true,
          email: true,
        },
      },
      typeMessage: {
        value: "",
        type: "select",
        label: "Тип сообщения",
        errorMessage: "Выберите категорию сообщения",
        valid: false,
        touched: false,
        validation: {
          required: true,
        },
      },
      message: {
        value: "",
        type: "text",
        label: "Сообщение",
        errorMessage: "Сообщение должно содержать не менее 10 символов",
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLength: 10,
        },
      },
      image: {
        value: "",
        type: "file",
        label: "Картинка",
        errorMessage: "Загрузите файл с JPG или PNG размером до 2Мб",
        valid: false,
        touched: false,
        size: 0,
        validation: {
          required: true,
          accept: ["image/jpg", "image/jpeg", "image/png"],
          maxSize: 2,
        },
      },
    },
  };

  submitHandler = (event) => {
    event.preventDefault();
    const formControls = this.state.formControls;
    let formData = {};
    Object.keys(formControls).forEach((control) => {
      const value = formControls[control].value;
      formData[control] = value;
    });
    console.group("Request data:");
    console.log(formData);
    console.groupEnd();

    alert(JSON.stringify(formData, null, " "));

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        console.group("Response:");
        console.log(data);
        console.groupEnd();
      });
    });
  };

  validateControl(value, validation) {
    if (!validation) {
      return true;
    } else {
      let isValid = true;
      if (!!validation.required) {
        if (value === null) {
          isValid = false;
        } else {
          if (typeof value === "string") {
            isValid = value.trim() !== "" && isValid;
          }
        }
      }
      if (value && validation.minLength) {
        isValid = value.length >= validation.minLength && isValid;
      }
      if (value && validation.email) {
        isValid = validateEmail(value) && isValid;
      }
      if (value && validation.accept) {
        isValid = validation.accept.includes(value.type) && isValid;
      }
      if (value && validation.maxSize) {
        const maxSizeB = validation.maxSize * 1024 * 1024;
        isValid = value.size <= maxSizeB && isValid;
      }

      /*  if (!value && validation.or && validation.or.length > 0) {
        console.log(value, validation);
        const formControls = { ...this.state.formControls };
        for (let name of validation.or) {
          const control = formControls[name];
          console.log(name, control.value, control.valid, isValid);
          isValid = control.value && control.valid && isValid;
          console.log(name, control.value, control.valid, isValid);
          if (isValid) break;
        } */
      /* Object.keys(formControls).forEach((name) => {
          const control = formControls[name];
          isValid = control.value && control.valid && isValid;
          if (isValid) return;
        }); */
      //}
      return isValid;
    }
  }

  validateHandler = (controlName) => {
    const formControls = {
      ...this.state.formControls,
    };
    let control = {
      ...formControls[controlName],
    };
    control.touched = true;
    control.valid = this.validateControl(control.value, control.validation);
    formControls[controlName] = control;
    let isFormValid = true;
    /*Object.keys(formControls).forEach((name) => {
      isFormValid = formControls[name].valid & isFormValid;
    }); */
    isFormValid = Object.keys(formControls).every(
      (name) => formControls[name].valid & isFormValid
    );
    /* console.group("isFormValid");
    console.log("isFormValid:", isFormValid);
    console.log(
      'formControls["firstName"].value:',
      formControls["firstName"].value
    );
    console.log(
      'formControls["firstName"].valid:',
      formControls["firstName"].valid
    );
    console.log(
      'formControls["lastName"].value:',
      formControls["lastName"].value
    );
    console.log(
      'formControls["lastName"].valid:',
      formControls["lastName"].valid
    );
    console.log(
      "firstName",
      !!formControls["firstName"].value & formControls["firstName"].valid
    );
    console.log(
      "lastName",
      !!formControls["lastName"].value & formControls["lastName"].valid
    );
    console.log(
      !!formControls["firstName"].value & formControls["firstName"].valid ||
        !!formControls["lastName"].value & formControls["lastName"].valid
    );
    console.groupEnd(); */
    if (
      !(
        !!formControls["firstName"].value & formControls["firstName"].valid ||
        !!formControls["lastName"].value & formControls["lastName"].valid
      )
    ) {
      isFormValid = false;
      if (controlName === "firstName" || controlName === "lastName") {
        let control = {
          ...formControls[controlName],
        };
        control.valid = false;
        formControls[controlName] = control;
      }
    } else {
      switch (controlName) {
        case "firstName": {
          let lastName = {
            ...formControls["lastName"],
          };
          lastName.valid = this.validateControl(
            lastName.value,
            lastName.validation
          );
          formControls["lastName"] = lastName;
          break;
        }
        case "lastName": {
          let firstName = {
            ...formControls["firstName"],
          };
          firstName.valid = this.validateControl(
            firstName.value,
            firstName.validation
          );
          formControls["firstName"] = firstName;
          break;
        }
        default:
          break;
      }
    }
    this.setState({
      formControls,
      isFormValid,
    });
  };

  componentWillMount() {
    this.validateForm();
  }

  validateForm() {
    const formControls = {
      ...this.state.formControls,
    };
    let isFormValid = true;
    Object.keys(formControls).forEach((name) => {
      const control = formControls[name];
      control.valid = this.validateControl(control.value, control.validation);
      isFormValid = control.valid & isFormValid;
      formControls[name] = control;
    });
    this.setState({
      formControls,
      isFormValid,
    });
  }

  changeHandler = (event, controlName) => {
    const formControls = {
      ...this.state.formControls,
    };
    formControls[controlName].value = event.target.value;
    this.setState({
      formControls,
    });
    if (formControls[controlName].touched) {
      this.validateHandler(controlName);
    }
  };

  fileHandler(event, control) {
    if (event.target.files.length > 0) {
      control.value = event.target.files[0];
      control.size = event.target.files[0].size;
    } else {
      control.size = 0;
      control.value = null;
    }
    return control;
  }

  changeAndValidateChangeHandler = (event, controlName) => {
    const formControls = {
      ...this.state.formControls,
    };
    let control = {
      ...formControls[controlName],
    };
    if (event.target.type === "file") {
      control = this.fileHandler(event, control);
    } else {
      control.value = event.target.value;
    }
    control.touched = true;
    control.valid = this.validateControl(control.value, control.validation);
    formControls[controlName] = control;
    let isFormValid = true;
    /*Object.keys(formControls).forEach((name) => {
      isFormValid = formControls[name].valid & isFormValid;
    }); */
    isFormValid = Object.keys(formControls).every(
      (name) => formControls[name].valid & isFormValid
    );

    /* console.group("isFormValid");
    console.log("isFormValid:", isFormValid);
    console.log(
      'formControls["firstName"].value:',
      formControls["firstName"].value
    );
    console.log(
      'formControls["firstName"].valid:',
      formControls["firstName"].valid
    );
    console.log(
      'formControls["lastName"].value:',
      formControls["lastName"].value
    );
    console.log(
      'formControls["lastName"].valid:',
      formControls["lastName"].valid
    );
    console.log(
      "firstName",
      !!formControls["firstName"].value & formControls["firstName"].valid
    );
    console.log(
      "lastName",
      !!formControls["lastName"].value & formControls["lastName"].valid
    );
    console.log(
      !!formControls["firstName"].value & formControls["firstName"].valid ||
        !!formControls["lastName"].value & formControls["lastName"].valid
    );
    console.groupEnd(); */
    if (
      !(
        !!formControls["firstName"].value & formControls["firstName"].valid ||
        !!formControls["lastName"].value & formControls["lastName"].valid
      )
    ) {
      isFormValid = false;
    }
    this.setState({
      formControls,
      isFormValid,
    });
  };

  render() {
    const firstName = this.state.formControls["firstName"];
    const lastName = this.state.formControls["lastName"];
    const email = this.state.formControls["email"];
    const typeMessage = this.state.formControls["typeMessage"];
    const message = this.state.formControls["message"];
    const image = this.state.formControls["image"];

    return (
      <form className="form" onSubmit={this.submitHandler}>
        <ul className="form__list">
          <li className="form__item">
            <label htmlFor="first-name" className="form__item-label">
              Имя{" "}
            </label>{" "}
            <div className="form__item-field">
              <input
                type="text"
                id="first-name"
                className="form__item-field-input"
                placeholder="Введите имя"
                value={firstName.value}
                onBlur={() => {
                  this.validateHandler("firstName");
                }}
                onChange={(event) => {
                  this.changeHandler(event, "firstName");
                }}
              ></input>{" "}
              {!!firstName.validation &&
                firstName.touched &&
                !firstName.valid && (
                  <div className="form__item-field-error">
                    {" "}
                    {firstName.errorMessage}{" "}
                  </div>
                )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <label htmlFor="last-name" className="form__item-label">
              Фамилия{" "}
            </label>{" "}
            <div className="form__item-field">
              <input
                type="text"
                className="form__item-field-input"
                id="last-name"
                placeholder="Введите фамилию"
                value={lastName.value}
                onBlur={() => {
                  this.validateHandler("lastName");
                }}
                onChange={(event) => {
                  this.changeHandler(event, "lastName");
                }}
              ></input>{" "}
              {!!lastName.validation && lastName.touched && !lastName.valid && (
                <div className="form__item-field-error">
                  {" "}
                  {lastName.errorMessage}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <label htmlFor="email" className="form__item-label">
              Email{" "}
            </label>{" "}
            <div className="form__item-field">
              <input
                type="email"
                className="form__item-field-input"
                id="email"
                placeholder="Введите email"
                value={email.value}
                onBlur={() => {
                  this.validateHandler("email");
                }}
                onChange={(event) => {
                  this.changeHandler(event, "email");
                }}
              ></input>{" "}
              {!!email.validation && email.touched && !email.valid && (
                <div className="form__item-field-error">
                  {" "}
                  {email.errorMessage}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <label htmlFor="type-message" className="form__item-label">
              Категория сообщения{" "}
            </label>{" "}
            <div className="form__item-field">
              <select
                id="type-message"
                className="form__item-field-input form__select"
                value={typeMessage.value}
                onChange={(event) => {
                  this.changeAndValidateChangeHandler(event, "typeMessage");
                }}
                /* options={this.state.typeMessageOptions} */
              >
                <option value="" disabled>
                  Выберите категорию сообщения{" "}
                </option>{" "}
                <option value="suggestion"> Предложение </option>{" "}
                <option value="appeal"> Обращение </option>{" "}
                <option value="review"> Отзыв </option>{" "}
              </select>{" "}
              {!!typeMessage.validation &&
                typeMessage.touched &&
                !typeMessage.valid && (
                  <div className="form__item-field-error">
                    {" "}
                    {typeMessage.errorMessage}{" "}
                  </div>
                )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <label htmlFor="message" className="form__item-label">
              Сообщение{" "}
            </label>{" "}
            <div className="form__item-field">
              <textarea
                rows="5"
                className="form__item-field-input"
                id="message"
                placeholder="Введите сообщение"
                style={{
                  resize: "none",
                }}
                value={message.value}
                onBlur={() => {
                  this.validateHandler("message");
                }}
                onChange={(event) => {
                  this.changeHandler(event, "message");
                }}
              ></textarea>{" "}
              {!!message.validation && message.touched && !message.valid && (
                <div className="form__item-field-error">
                  {" "}
                  {message.errorMessage}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <label htmlFor="image" className="form__item-label">
              {" "}
              {image.label}{" "}
            </label>{" "}
            <div className="form__item-field">
              <input
                type={image.type}
                className="form__item-field-input form__upload-field upload-field--blue"
                accept={image.accept}
                id="image"
                onChange={(event) => {
                  this.changeAndValidateChangeHandler(event, "image");
                }}
              />{" "}
              {!!image.validation && image.touched && !image.valid && (
                <div className="form__item-field-error">
                  {" "}
                  {image.errorMessage}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </li>{" "}
          <li className="form__item">
            <button
              type="submit"
              className="btn btn--blue"
              disabled={!this.state.isFormValid}
            >
              Отправить{" "}
            </button>{" "}
          </li>{" "}
        </ul>{" "}
      </form>
    );
  }
}

export default Form;
