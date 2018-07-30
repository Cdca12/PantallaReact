import React, { Component } from 'react';
import { Form, Table, Button, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';

export default class App extends Component {


  state = {
    id: 0,
    nombre: '',
    fechaNacimiento: '',
    edad: '',
    colorFavorito: '',
    infoPersonas: [],
    infoPersonasFiltradas: [],
    isFiltered: false,
    showModal: false,
    showAddModal: false,
    idAux: '',


  }

  calcularEdad = (fecha) => {
    let hoy = new Date();
    let cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    let m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    return edad;
  }


  handleNombreChange = (event) => {
    this.setState({ nombre: event.target.value });
  }

  handleFechaNacimientoChange = (event) => {
    this.setState({ fechaNacimiento: event.target.value });
  }

  handlePesoChange = (event) => {
    this.setState({ peso: event.target.value });
  }

  handleColorFavoritoChange = (event) => {
    this.setState({ colorFavorito: event.target.value });
  }

  handleAñadir = () => {
    let persona = {
      id: this.state.id + 1,
      nombre: this.state.nombre,
      fechaNacimiento: this.state.fechaNacimiento,
      colorFavorito: this.state.colorFavorito,
      peso: this.state.peso,
      edad: this.calcularEdad(this.state.fechaNacimiento) // Calcular edad

    }
    let infoPersonas = [...this.state.infoPersonas, persona];
    this.setState({
      id: persona.id,
      infoPersonas,
      nombre: '',
      fechaNacimiento: '',
      edad: '',
      colorFavorito: '',
      peso: ''
    });

    // Test
    console.log(this.state.infoPersonas)
  }

  handleGuardar = (id) => {
    const index = this.state.infoPersonas.findIndex((elemento) => elemento.id === id);

    const infoPersonas = this.state.infoPersonas;
    infoPersonas[index].nombre = this.state.nombre;
    infoPersonas[index].fechaNacimiento = this.state.fechaNacimiento;
    infoPersonas[index].colorFavorito = this.state.colorFavorito;
    infoPersonas[index].peso = this.state.peso;


    // Test
    return (
      console.log(index),
      console.log('Guardado correcto')
    )
  }

  handleEliminar = (id) => {
    let infoPersonas = this.state.infoPersonas.filter((elemento) => {
      return elemento.id !== id
    });
    this.setState({ infoPersonas });
  }

  renderEditModal = () => {
    return (
      <div>
        <Form>
          <Form.Group widths='equal' style={{ width: '95%', marginTop: '5px' }}>
            <Form.Field>
              <label>Nombre</label>
              <input type="text" value={this.state.nombre} onChange={this.handleNombreChange} />
            </Form.Field>
            <Form.Field>
              <label>Fecha de Nacimiento</label>
              <input type="date" value={this.state.fechaNacimiento} onChange={this.handleFechaNacimientoChange} />
            </Form.Field>
            <Form.Field>
              <label>Edad</label>
              <input type="text" readOnly="" placeholder={this.state.edad} />
            </Form.Field>
            <Form.Field>
              <label>Color Favorito</label>
              <input type="text" value={this.state.colorFavorito} placeholder='Escriba su color favorito' onChange={this.handleColorFavoritoChange} />
            </Form.Field>
          </Form.Group>
        </Form>

        <div style={{ float: 'right', marginBottom: '10px', marginTop: '10px' }}>
          <Button style={{ alig: 'right' }}
            onClick={() => this.setState({ showModal: false })}>Cerrar</Button>
          <Button color='green' onClick={() => {
            this.setState({ showModal: false, colorFavorito: '',  },
              this.handleGuardar(this.state.idAux))
          }}>Guardar</Button>
        </div>
      </div>
    )
  }

  renderAddModal = () => {
    return (
      <div>
        <Form>
          <Form.Group widths='equal' style={{ width: '95%', marginTop: '5px' }}>
            <Form.Input fluid label='Nombre' placeholder='Escriba el nombre...' onChange={this.handleNombreChange} />
            <Form.Input type='date' fluid label='Fecha de Nacimiento' placeholder='Escriba la fecha de nacimiento...' onChange={this.handleFechaNacimientoChange} />
            <Form.Input fluid label='Edad' value={this.state.edad} />
            <Form.Input fluid label='Peso' placeholder='Escriba el peso...' onChange={this.handlePesoChange} />
            <Form.Input fluid label='Color Favorito' placeholder='Escriba el color favorito...' onChange={this.handleColorFavoritoChange} />
          </Form.Group>
        </Form>

        <div style={{ float: 'right', marginBottom: '10px', marginTop: '10px' }}>
          <Button style={{ alig: 'right' }}
            onClick={() => this.setState({ showAddModal: false })}>Cerrar</Button>
          <Button color='green' onClick={() => {
            this.setState({ showAddModal: false, },
              this.handleAñadir())
          }}>Guardar</Button>
        </div>
      </div>
    )
  }


  handleFilterByName = (event) => {
    
    // hace un filtrado del array de usuarios para obtener
    // aquellos cuyo nombre contiene lo ingresado en el input
    let infoPersonasFiltradas = this.state.infoPersonas.filter((elemento) => {
      let texto = event.target.value.toLowerCase().trim();
      let nombre = elemento.nombre.toLowerCase();

      if (texto.length > 0) {
        this.setState({ isFiltered: true });
      } else {
        this.setState({ isFiltered: false });
      }
      return nombre.includes(texto);
    });

    // Actualiza el estado y por ende, la tabla
    this.setState({ infoPersonasFiltradas });
  }


  handleFilterByDate = (event) => {
    let infoPersonasFiltradas = this.state.infoPersonas.filter((elemento) => {
      let texto = event.target.value;
      let fecha = elemento.fechaNacimiento;

      if (texto.length > 0) {
        this.setState({ isFiltered: true });
      } else {
        this.setState({ isFiltered: false });
      }
      return fecha.includes(texto);
    });
    this.setState({ infoPersonasFiltradas });

  }

  renderPersonasList = () => {
    let infoMapear = this.state.isFiltered ? this.state.infoPersonasFiltradas : this.state.infoPersonas;

    return infoMapear.map((elemento) => {
      return (
        <Table.Row key={elemento.id}>
          <Table.Cell>{elemento.nombre}</Table.Cell>
          <Table.Cell>{elemento.edad}</Table.Cell>
          <Table.Cell>
            <Button color='red' onClick={() => { this.handleEliminar(elemento.id) }}>Eliminar</Button>
            <Modal
              open={this.state.showModal}
              onClose={() => { this.setState({ showModal: false }) }}
              trigger={<Button color='yellow' onClick={() => {
                this.setState({
                  showModal: true,
                  idAux: elemento.id,
                  nombre: elemento.nombre,
                  fechaNacimiento: elemento.fechaNacimiento,
                  edad: elemento.edad,
                  colorFavorito: elemento.colorFavorito,
                  peso: elemento.peso
                })
              }}>Editar</Button>}>
              <Modal.Header>Editar Persona</Modal.Header>
              <Modal.Content>
                {this.renderEditModal()}
              </Modal.Content>
            </Modal>
          </Table.Cell>
        </Table.Row>
      )
    })
  }

  render() {
    return (
      <div>
        <Form style={{ marginTop: '12px' }
        }>
          <Form.Group widths='equal' style={{ width: '70%', marginLeft: '10px' }}>
            {/* TODO: Limpiar al dar en Añadir
          value={this.state.nombre} , que se muestre el  placeholder */}
            <Form.Input fluid label='Nombre' placeholder='Escriba el nombre...' onChange={this.handleFilterByName} />
            <Form.Input type='date' fluid label='Fecha de Nacimiento' placeholder='Escriba la fecha de nacimiento...' onChange={this.handleFilterByDate} />


            <Modal
              size='large'
              open={this.state.showAddModal}
              onClose={() => { this.setState({ showAddModal: false }) }}
              trigger={<Form.Button style={{ marginTop: '23px' }} color='blue'
                onClick={() => {
                  this.setState({
                    showAddModal: true,
                    idAux: '',
                    nombre: '',
                    fechaNacimiento: '',
                    edad: '',
                    colorFavorito: '',
                    peso: ''
                  })
                }}>Añadir</Form.Button>}>
              <Modal.Header>Añadir Persona</Modal.Header>
              <Modal.Content>
                {this.renderAddModal()}
              </Modal.Content>
            </Modal>

          </Form.Group>
        </Form>

        {/* TODO: Poner tabla centrada 
            style = {
              { width: '200px', margin: '0 auto' }
              */}
        <Table celled>
          <Table.Header>
            <Table.Row >
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Edad</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderPersonasList()}
          </Table.Body>
        </Table>
      </div >
    );
  }
}
