import React from "react"
import contactformStyles from "./contactform.module.css"

class TheFormComponent extends React.Component {
  state = {
    name: "",
    email: "",
    subject: "",
    message: "",
    isSubmitting: false,
    submitSuccess: false,
    submitFail: false,
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.submitData({
      "text": `Name: ${this.state.name}\n\nEmail: ${this.state.email}\n\nSubject: ${this.state.subject}\n\nMessage: ${this.state.message}`
    });
  }

  submitData = async data => {
    const url = process.env.GATSBY_AWS_CONTACT_URL || 'https://localhost/url';

    console.log("URL: ", url);

    try {
      this.setState({
        isSubmitting: true,
      });
      await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      this.setState({
        submitSuccess: true,
      });
      this.clearStateData();
    } catch (e) {
      this.setState({
        isSubmitting: false,
      });
      this.setState({
        submitFail: true,
      });
      console.log('Error ocurred when trying to submit data\n', e);
    }
  }

  clearStateData = () => {
    this.setState({
      name: "",
      email: "",
      subject: "",
      message: "",
      isSubmitting: false,
    });
  }

  render() {

    const showSuccess = (
      <span className={contactformStyles.successMessage}>Message successfully delivered!</span>
    );

    const showFail = (
      <span className={contactformStyles.failMessage}>An error occurred Please try again.</span>
    );

    return (
      <div>
        <form className={contactformStyles.form} onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name" className={contactformStyles.label}>Name:</label>
            <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleInputChange} disabled={this.state.isSubmitting} />          
          </div>
          <div>
            <label htmlFor="email" className={contactformStyles.label}>Email:</label>
            <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleInputChange} disabled={this.state.isSubmitting} />
          </div>
          <div>
            <label htmlFor="subject" className={contactformStyles.label}>Subject:</label>
            <input type="text" name="subject" id="subject" value={this.state.subject} onChange={this.handleInputChange} disabled={this.state.isSubmitting} />
          </div>
          <div>
            <label htmlFor="message" className={contactformStyles.label}>Message:</label>
            <textarea name="message" id="message" rows="5" value={this.state.message} onChange={this.handleInputChange} disabled={this.state.isSubmitting} />
          </div>
          <button type="submit" className={contactformStyles.submitButton} disabled={this.state.isSubmitting}>Send</button>
        </form>
      <div className={contactformStyles.messageContainer}>
        {this.state.submitSuccess ? showSuccess : null}
        {this.state.submitFail ? showFail : null}
      </div>
      </div>
    )
  }
}

export default () => {
  return (
    <div>
      <TheFormComponent />
    </div>
  )
}