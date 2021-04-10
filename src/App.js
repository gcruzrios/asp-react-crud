import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

  const baseUrl="https://localhost:44392/api/gestores";
  const [data, setData] = useState([]);
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
    id:'',
    nombre:'',
    lanzamiento:'',
    desarrollador:'',
  });

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false)

  const [modalEliminar, setModalEliminar] = useState(false)
  
  const handleChange=e=>{
      const{name, value} = e.target;
      setGestorSeleccionado({
        ...gestorSeleccionado,
        [name]:value
      });
      //console.log(gestorSeleccionado)  
  }

  const abrirCerrarModalInsertar = () =>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () =>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () =>{
    setModalEliminar(!modalEliminar);
  }


  const peticionGet=async ()=>{
    await axios.get(baseUrl)
      .then(response =>{
        setData(response.data);
      }).catch(err =>{
        console.log(err);
      })
  }

  const peticionPost=async ()=>{
    delete gestorSeleccionado.id;
    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.post(baseUrl, gestorSeleccionado)
      .then(response =>{
        setData(data.concat(response.data));
        abrirCerrarModalInsertar()
      }).catch(err =>{
        console.log(err);
      })
  }

  const seleccionarGestor = (gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
      abrirCerrarModalEditar(): abrirCerrarModalEliminar();
           
  }

  const peticionPut=async ()=>{

    gestorSeleccionado.lanzamiento = parseInt(gestorSeleccionado.lanzamiento);
    await axios.put(baseUrl+"/"+ gestorSeleccionado.id, gestorSeleccionado)
      .then(response =>{
        var respuesta= response.data;
        var dataAuxiliar=data;

        
        dataAuxiliar.map(gestor=>{
          if (gestor.id ===gestorSeleccionado.id){
            gestor.nombre = respuesta.nombre;
            gestor.lanzamiento = respuesta.lanzamiento;
            gestor.desarrollador = respuesta.desarrollador;
          } 
        })
        abrirCerrarModalEditar()
      }).catch(err =>{
        console.log(err);
      })
  }

  const peticionDelete=async ()=>{

   
    await axios.delete(baseUrl+"/"+ gestorSeleccionado.id)
      .then(response =>{
        setData(data.filter(gestor=>gestor.id !== response.data));
     
        
        abrirCerrarModalEliminar()
      }).catch(err =>{
        console.log(err);
      })
  }

  useEffect(() => {
    peticionGet();
  }, [])


  return (
    <div className="App">
        <div className="container">
         <br/><br/>
          <div className="row">
             <div className="col-md-9 ">

             </div>
             <div className="col-md-3 ml-auto">
               <button className="btn btn-primary" onClick={()=>abrirCerrarModalInsertar()}>Insertar Nuevo gestor</button>
             </div>
          </div>
          <br/><br/>
          
          <table className="table table-bordered">
            <thead>
              <tr>
                <th> Id </th>
                <th> Nombre</th>
                <th> Lanzamiento </th>
                <th> Desarrollador </th>
                <th> Acciones </th>
              </tr>
            </thead>
            <tbody>
              {data.map(gestor =>(
                <tr key={gestor.id}>
                  <td>{gestor.id}</td>
                  <td>{gestor.nombre}</td>
                  <td>{gestor.lanzamiento}</td>
                  <td>{gestor.desarrollador}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button>{" "}
                    <button className="btn btn-danger"  onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      

    
       <Modal isOpen={modalInsertar}>
          <ModalHeader>Insertar gestor de Base de datos</ModalHeader>  
          <ModalBody>
            <div className="form-group">
              <label>Nombre:</label>
              <br/>
              <input type= "text" className="form-control" name="nombre" onChange={handleChange}/>
              <br/>
              <label>Lanzamiento:</label>
              <br/>
              <input type= "text" className="form-control" name="lanzamiento" onChange={handleChange}/>
              <br/>
              <label>Desarrollador:</label>
              <br/>
              <input type= "text" className="form-control" name="desarrollador" onChange={handleChange}/>
              <br/>
              
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=> peticionPost()}>Insertar</button> { "  " }
            <button className="btn btn-danger" onClick={()=> abrirCerrarModalInsertar()}>Cancelar</button>
          </ModalFooter>
       </Modal>     


       <Modal isOpen={modalEditar}>
          <ModalHeader>Editar gestor de Base de datos</ModalHeader>  
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <br/>
              <input type= "text" className="form-control" value={gestorSeleccionado && gestorSeleccionado.id} readOnly />
              <br/>
              <label>Nombre:</label>
              <br/>
              <input type= "text" className="form-control" value={gestorSeleccionado && gestorSeleccionado.nombre} name="nombre" onChange={handleChange}/>
              <br/>
              <label>Lanzamiento:</label>
              <br/>
              <input type= "text" className="form-control" value={gestorSeleccionado && gestorSeleccionado.lanzamiento} name="lanzamiento" onChange={handleChange}/>
              <br/>
              <label>Desarrollador:</label>
              <br/>
              <input type= "text" className="form-control" value={gestorSeleccionado && gestorSeleccionado.desarrollador} name="desarrollador" onChange={handleChange}/>
              <br/>
              
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=> peticionPut()}>Editar</button> { "  " }
            <button className="btn btn-danger" onClick={()=> abrirCerrarModalEditar()}>Cancelar</button>
          </ModalFooter>
       </Modal>   

       <Modal isOpen={modalEliminar}>
          <ModalHeader>Eliminar gestor de Base de datos</ModalHeader>  
          <ModalBody>
             ¿ Estás seguro de eliminar el gestor de Datos  {gestorSeleccionado && gestorSeleccionado.nombre} ?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=> peticionDelete() }>Si</button>
            <button className="btn btn-primary" onClick={()=> abrirCerrarModalEliminar() }>No</button>
            
          </ModalFooter>
       </Modal>   
    </div>
  );
}

export default App;
