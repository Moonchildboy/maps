import React, {Component} from 'react';  

/* Import Components */
import Input from '../components/Input';  
import Country from '../components/Country';
import Province from '../components/Province';
import Button from '../components/Button'

class FormContainer extends Component {  
  statics: {
    DEFAULT_COUNTRY: 484;
  }

  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      provinces: [],
      newCoop: {
        name: '',
        type: {
          name: ''
        },
        address: {
          formatted: '',
          locality: {
            name: '',
            postal_code: '',
            state: ''
          },
          country: 484, //FormContainer.DEFAULT_COUNTRY,
        },
        enabled: true,
        email: '',
        phone: '',
        web_site: '' 
      },

    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  /* This life cycle hook gets executed when the component mounts */

  handleFormSubmit(e) {
    e.preventDefault();
    const NC = this.state.newCoop;
    delete NC.address.country;

    fetch('/coops/',{
        method: "POST",
        body: JSON.stringify(this.state.newCoop),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => {
        response.json().then(data =>{
          console.log("Successful" + data);
        })
    })
  }
  handleClearForm() {
    // Logic for resetting the form
  }
  handleInput(e) {
    let self=this
    let value = e.target.value;
    console.log("value:" + value);
    let name = e.target.name;
    //update State
    this.setValue(self.state.newCoop,name,value)
  }

  setValue = (obj,is, value) => {
       if (typeof is == 'string')
         return this.setValue(obj,is.split('.'), value);
       else if (is.length === 1 && value!==undefined)
         return this.setState({obj: obj[is[0]] = value});
       else if (is.length === 0)
         return obj;
       else
         return this.setValue(obj[is[0]],is.slice(1), value);
  }

  render() {
    return (
        <form className="container-fluid" onSubmit={this.handleFormSubmit}>
       
            <Input inputType={'text'}
                   title= {'Name'} 
                   name= {'name'}
                   value={this.state.newCoop.name} 
                   placeholder = {'Enter cooperative name'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Name of the cooperative */}
 
            <Input inputType={'text'}
                   title= {'Type'} 
                   name= {'type.name'}
                   value={this.state.newCoop.type.name} 
                   placeholder = {'Enter cooperative type'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Type of the cooperative */}
 
            <Input inputType={'text'}
                   title= {'Street'} 
                   name= {'address.formatted'}
                   value={this.state.newCoop.address.formatted} 
                   placeholder = {'Enter address street'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Address street of the cooperative */}
 
            <Input inputType={'text'}
                   title= {'City'} 
                   name= {'address.locality.name'}
                   value={this.state.newCoop.address.locality.name} 
                   placeholder = {'Enter address city'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Address city of the cooperative */}
        
          <Country title={'Country'}
                  name={'address.country'}
                  options = {this.state.countries} 
                  value = {this.state.newCoop.address.country}
                  placeholder = {'Select Country'}
                  handleChange = {this.handleInput}
                  /> {/* Country Selection */}

          <Province title={'State'}
                  name={'address.locality.state'}
                  options = {this.state.provinces} 
                  value = {this.state.newCoop.address.locality.state}
                  placeholder = {'Select State'}
                  handleChange = {this.handleInput}
                  /> {/* State Selection */}

          <Input inputType={'text'}
                   title= {'Postal Code'} 
                   name= {'address.locality.postal_code'}
                   value={this.state.newCoop.address.locality.postal_code} 
                   placeholder = {'Enter postal code'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Address postal code of the cooperative */}
 
          <Input inputType={'text'}
                   title= {'Email'} 
                   name= {'email'}
                   value={this.state.newCoop.email} 
                   placeholder = {'Enter email'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Email of the cooperative */}
 
          <Input inputType={'text'}
                   title= {'Phone'} 
                   name= {'phone'}
                   value={this.state.newCoop.phone} 
                   placeholder = {'Enter phone number'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Phone number of the cooperative */}

          <Input inputType={'text'}
                   title= {'Web Site'} 
                   name= {'web_site'}
                   value={this.state.newCoop.web_site} 
                   placeholder = {'Enter web site'}
                   handleChange = {this.handleInput}
                   
                   /> {/* Web site of the cooperative */}


          <Button 
              action = {this.handleFormSubmit}
              type = {'primary'} 
              title = {'Submit'} 
            style={buttonStyle}
          /> { /*Submit */ }
          
          <Button 
            action = {this.handleClearForm}
            type = {'secondary'}
            title = {'Clear'}
            style={buttonStyle}
          /> {/* Clear the form */}
          
        </form>
    );
  }

  componentDidMount() {
    let initialCountries = [];
    let initialProvinces = [];
    // Get initial countries 
    fetch('/countries/')
        .then(response => {
            return response.json();
        }).then(data => {
        initialCountries = data.map((country) => {
            return country
        });
        console.log("output ...");
        console.log(initialCountries);
        this.setState({
            countries: initialCountries,
        });
    });
    // Get initial provinces (states) 
    fetch('/states/484/')
        .then(response => {
            return response.json();
        }).then(data => {
        console.log(data); 
        initialProvinces = data.map((province) => {
            return province
        });
        this.setState({
            provinces: initialProvinces,
        });
    });
  }
}

const buttonStyle = {
  margin : '10px 10px 10px 10px'
}

export default FormContainer;


