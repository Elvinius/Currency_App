import React, { Component } from "react";
import axios from 'axios';
import { Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, Label, Input, FormGroup } from 'reactstrap';

class App extends Component{
  //initial state details
   state = {
     currencies: [],
     error: '',
     newCurrencyData: {
       name: '',
       shortCode: '',
       rate: ''
     },
     editCurrencyData: {
      id: '',
      name: '',
      shortCode: '',
      rate: ''
    },
     newCurrencyModal: false,
     editCurrencyModal: false
   }

   componentWillMount() {
     this._refreshCurrencies();
   }
  
 toggleNewCurrencyModal() {
   this.setState({
    newCurrencyModal: ! this.state.newCurrencyModal,
    newCurrencyData: {},
    error:''
   });
 }

 toggleEditCurrencyModal() {
  this.setState({
   editCurrencyModal: ! this.state.editCurrencyModal,
   error:''
  });
}

//To add a new currency through axios post method
 addCurrency() {
   axios.post('http://localhost:9000/currencies/', this.state.newCurrencyData).then((response) => {
      let { currencies } = this.state;
      currencies.push(this.state.newCurrencyData);
      this.setState({currencies, newCurrencyModal : false, newCurrencyData: {
        name: '',
        shortCode: '',
        rate: ''
      }})
   })
   .catch(err => {
     this.setState({error : err.response.data});
   })
 }

 //Update the currency 
 updateCurrency() {
  let { name, shortCode, rate} = this.state.editCurrencyData;
  axios.patch(`http://localhost:9000/currencies/${this.state.editCurrencyData.id}`, {name, shortCode, rate }).then((response) => {
    this._refreshCurrencies();
    this.setState({
      editCurrencyModal: false, editCurrencyData: {name: '', shortCode: '', rate: ''}
    })
 })
 .catch(err => {
  this.setState({error : err.response.data});
})
 }

 editCurrency(id, name, shortCode, rate) {
   this.setState({
     editCurrencyData: {id, name, shortCode, rate}, editCurrencyModal: !this.state.editCurrencyModal
   })
  }

  //delete currency
  deleteCurrency(id) {
    axios.delete(`http://localhost:9000/currencies/${id}`).then((response) => {
      this._refreshCurrencies();
    }) 
  }
 //refresh the list of the currencies after the operations
  _refreshCurrencies() {
    axios.get('http://localhost:9000/currencies/').then((response) => {
      this.setState({
        currencies: response.data
      })
    });
   }

  render () {
     // to map currencies and render them inside the table
      let currencies =  this.state.currencies.map((currency) => {
        return (
          <tr key={currency._id}>
            <td>{currency.name}</td>
            <td>{currency.shortCode}</td>
            <td>{currency.rate}</td>
            <td>
              <Button color="success" size="sm" className="mr-2 mb-1" onClick={this.editCurrency.bind(this, currency._id, currency.name, currency.shortCode, currency.rate)}>Edit</Button>
              <Button color="danger" size="sm" onClick={this.deleteCurrency.bind(this, currency._id)}>Delete</Button>
            </td>
          </tr>
        )
      })
    return (
      <div className="App container">
        <div className="jumbotron">
          <h1>EURO EXCHANGE RATE TABLES</h1>
          <Button className="my-3" color="primary" onClick={this.toggleNewCurrencyModal.bind(this)}>Add a new currency</Button>
          
          <Modal isOpen={this.state.newCurrencyModal} toggle={this.toggleNewCurrencyModal.bind(this)}>
            <ModalHeader toggle={this.toggleNewCurrencyModal.bind(this)}>{this.state.error ? <h6 className="alert alert-danger p-1" role="alert">{this.state.error}</h6> : "Add a new currency"}</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input id="name" value={this.state.newCurrencyData.name} onChange={(e) => {
                  let {newCurrencyData} = this.state;
                  newCurrencyData.name = e.target.value;
                  this.setState({newCurrencyData, error: ''});
                }}/>
              </FormGroup>
              <FormGroup>
                <Label for="shortCode">Short code</Label>
                <Input id="shortCode" value={this.state.newCurrencyData.shortCode} onChange={(e) => {
                  let {newCurrencyData} = this.state;
                  newCurrencyData.shortCode = e.target.value;
                  this.setState({newCurrencyData, error: ''});
                }}/>
              </FormGroup>
              <FormGroup>
                <Label for="rate">Rate</Label>
                <Input id="rate" value={this.state.newCurrencyData.rate} onChange={(e) => {
                  let {newCurrencyData} = this.state;
                  newCurrencyData.rate = e.target.value;
                  this.setState({newCurrencyData, error: ''});
                }}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addCurrency.bind(this)}>Add currency</Button>{' '}
              <Button color="secondary" onClick={this.toggleNewCurrencyModal.bind(this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.editCurrencyModal} toggle={this.toggleEditCurrencyModal.bind(this)}>
            <ModalHeader toggle={this.toggleEditCurrencyModal.bind(this)}>{this.state.error ? <h6 className="alert alert-danger p-1" role="alert">{this.state.error}</h6> : "Edit the currency"}</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input id="name" value={this.state.editCurrencyData.name} required onChange={(e) => {
                  let {editCurrencyData} = this.state;
                  editCurrencyData.name = e.target.value;
                  this.setState({editCurrencyData, error:''});
                }}/>
              </FormGroup>
              <FormGroup>
                <Label for="shortCode">Short code</Label>
                <Input id="shortCode" value={this.state.editCurrencyData.shortCode} required onChange={(e) => {
                  let {editCurrencyData} = this.state;
                  editCurrencyData.shortCode = e.target.value;
                  this.setState({editCurrencyData, error:''});
                }}/>
              </FormGroup>
              <FormGroup>
                <Label for="rate">Rate</Label>
                <Input id="rate" value={this.state.editCurrencyData.rate} required onChange={(e) => {
                  let {editCurrencyData} = this.state;
                  editCurrencyData.rate = e.target.value;
                  this.setState({editCurrencyData, error:''});
                }}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.updateCurrency.bind(this)}>Edit a currency</Button>{' '}
              <Button color="secondary" onClick={this.toggleEditCurrencyModal.bind(this)}>Cancel</Button>
            </ModalFooter>
          </Modal>
        <Table>
          <thead>
              <th>Name</th>
              <th>Short code</th>
              <th>Rate</th>
              <th>Actions</th>
            </thead>
            <tbody>
              {currencies}
            </tbody>
        </Table>
      </div>
    </div>
    );
  }
}

export default App;