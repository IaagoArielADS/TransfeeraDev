import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm"
import firebaseDb from "../firebase";
import { sorting, json_to_array } from "../sort"
import { search } from "../sort"
import { Button, Grid, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import logo from '../transfeera.jpg'
import { Snackbar } from "@material-ui/core";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const Contacts = () => {

    const usersPerPage = 10;

    var [contactObjects, setContactObjects] = useState({})
    var [currentId, setCurrentId] = useState('')
    var [currentPage, setCurrentPage] = useState(1)
    var [currentSearch, setCurrentSearch] = useState('')
    var [currentSearchedObjects, setCurrentSearchedObjects] = useState({})
    var [checkedCheckboxes, setCheckedCheckboxes] = useState(Array(11).fill(false))
    var [modalIsOpen, setModalIsOpen] = useState(false) 
    var [snackbarIsVisible, setSnackbarIsVisible] = useState(false)
    var [snackbarMessage, setSnackbarMessage] = useState('')
    var [snackbarSeverity, setSnackbarSeverity] = useState('success')
    
    useEffect(() => {
        let initData={}
        firebaseDb.child('favorecidos').on('value', snapshot => {
            if (snapshot.val() != null)
                initData = {...initData,...snapshot.val()}
            else
                initData = {...initData,...{}}
                setContactObjects(sorting(initData, 'nome'))
                setCurrentSearchedObjects(search(sorting(initData, 'nome'),"",1))
        })
    }, [])// similar to componentDidMount

    const getData = () => {
        var initData = {}
        firebaseDb.child('favorecidos').on('value', snapshot => {
            
            if (snapshot.val() != null)
                initData = {...initData,...snapshot.val()}
            else
                initData = {...initData,...{}}
        })
        return initData
    }

    const addOrEdit = obj => {
        if (currentId === ''){
            firebaseDb.child('favorecidos').push(
                obj,
                err => {
                    if (err){
                        console.error(err)
                        setSnackbarMessage("Erro ao cadastrar novo favorecido.")
                        setSnackbarSeverity("error")
                        setSnackbarIsVisible(true)
                    }
                    else{
                        setCurrentId('')
                        setSnackbarMessage("Favorecido cadastrado com sucesso!")
                        setSnackbarSeverity("success")
                        setSnackbarIsVisible(true)
                    }
                }
            )
            setCheckedCheckboxes(Array(11).fill(false))
        } else {
            firebaseDb.child(`favorecidos/${currentId}`).set(
                obj,
                err => {
                    if (err){
                        console.error(err)
                        setSnackbarMessage("Erro ao editar favorecidos.")
                        setSnackbarSeverity("error")
                        setSnackbarIsVisible(true)
                    }
                    else{
                        setCurrentId('')
                        setSnackbarMessage("Favorecido editado com sucesso!")
                        setSnackbarSeverity("success")
                        setSnackbarIsVisible(true)
                    }
                }
            )
            setCheckedCheckboxes(Array(11).fill(false))
        } 
    }

    const onDelete = () => {
        if (window.confirm('Você tem certeza de que quer apagar todos os registros selecionados?')) {
            json_to_array(currentSearchedObjects)
            .map((customer)=>customer.firebaseId)
            .filter(function(c,i){
                return checkedCheckboxes[i]
            })
            .map((toDeleteId)=>
                firebaseDb.child(`favorecidos/${toDeleteId}`).remove(
                    err => {
                        if (err){
                            console.error(err)
                            setSnackbarMessage("Erro ao excluir favorecidos.")
                            setSnackbarSeverity("error")
                            setSnackbarIsVisible(true)
                        }
                        else{
                            setCurrentId('')
                            setSnackbarMessage("Favorecidos excluídos com sucesso!")
                            setSnackbarSeverity("success")
                            setSnackbarIsVisible(true)
                        }
                    }
                )
            )
            let initData = getData()
            setContactObjects(sorting(initData, 'nome'))
            setCurrentSearchedObjects(search(sorting(initData, 'nome'),"",1))
            setCheckedCheckboxes([...Array(11).fill(false)])

        }else{
            setSnackbarMessage("Operação abortada. \n Nenhum registro deletado")
            setSnackbarSeverity("info")
            setSnackbarIsVisible(true)
        }
    }

    const deleteFromModal = () => {
        if (window.confirm('Você tem certeza de que quer apagar esse favorecido?')) {
            let toDeleteId = currentId
            firebaseDb.child(`favorecidos/${toDeleteId}`).remove(
                err => {
                    if (err){
                        setSnackbarMessage("Erro ao excluir favorecidos.")
                        setSnackbarSeverity("error")
                        setSnackbarIsVisible(true)
                    }
                    else{
                        setCurrentId('')
                        setSnackbarMessage("Favorecidos excluídos com sucesso!")
                        setSnackbarSeverity("success")
                        setSnackbarIsVisible(true)
                    }
                }
            )
            let initData = getData()
            setContactObjects(sorting(initData, 'nome'))
            setCurrentSearchedObjects(search(sorting(initData, 'nome'),"",1))
            setCheckedCheckboxes([...Array(11).fill(false)])
            setModalIsOpen(false)
        } else {
            setSnackbarMessage("Operação abortada. \n Nenhum registro deletado")
            setSnackbarSeverity("info")
            setSnackbarIsVisible(true)
        }
    }

    const snackBarOnClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarIsVisible(false);
    };

    return (
        <>
            <Grid style={{backgroundColor:"transparent"}}>
                <img height="50px" src={logo}/>
            </Grid>
            <Grid style={{backgroundColor:"#1fbfae"}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={true} >
                        <Tab style={{color:"#ffffff"}} label="Seus Favorecidos" />
                    </Tabs>
                </Box>
            </Grid>
            <Grid 
                style={{backgroundColor:"transparent"}}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid style={{backgroundColor:"transparent"}}>
                    <Button style={{height:"100px"}}onClick={()=>{setModalIsOpen(true);setCurrentId('')}}>
                        <Typography style={{fontSize: '1.8em'}}> 
                            Seus favorecidos <AddCircle style={{color:"#1fbfae",fontSize: '1.8em'}}/>
                        </Typography>
                    </Button>
                </Grid>

                <Grid >
                    <Input 
                        placeholder="Nome, CPF, agência ou conta" 
                        onChange={(event)=>{
                            setCurrentSearch(event.target.value); 
                            setCurrentSearchedObjects(search(contactObjects,event.target.value,currentPage))
                            setCurrentPage(1)
                        }}
                    />
                </Grid>
            </Grid>
            <ContactForm {...({ addOrEdit, currentId, contactObjects, modalIsOpen, setModalIsOpen, deleteFromModal })} />
            <Grid>
                
                    <Button 
                        variant={"contained"} 
                        color={"error"}
                        onClick={()=>onDelete()}
                    >
                        Excluir Selecionados
                    </Button>
                    <div className="form-group input-group">
                        
                        
                       
                    </div>
                        <table className="table table-borderless table-stripped">
                            <thead className="thead-light">
                                <tr>
                                    <th>
                                        <Checkbox
                                            checked={checkedCheckboxes.at(-1)}
                                            onChange={(event)=>{
                                                setCheckedCheckboxes(Array(11).fill(event.target.checked))
                                            }}
                                        />
                                    </th>
                                    <th>Favorecido</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Banco</th>
                                    <th>Agência</th>
                                    <th>CC</th>
                                    <th>Status do favorecido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(currentSearchedObjects).map(id => {
                                        return <tr 
                                            style={{cursor:'pointer'}} 
                                            onClick={() => {
                                                setCurrentId(currentSearchedObjects[id].firebaseId)
                                                setModalIsOpen(true)
                                                } 
                                            } key={id}>
                                            <td onClick={(e)=>e.stopPropagation()}>
                                                <Checkbox
                                                    checked={checkedCheckboxes.at(id)}
                                                    onChange={(event)=>{
                                                        let arr = checkedCheckboxes;
                                                        arr[id] = event.target.checked;
                                                        arr[arr.length - 1] = arr.slice(0, -1).includes(true)
                                                        setCheckedCheckboxes([...arr])
                                                    }}
                                                />
                                            </td>
                                            <td>{currentSearchedObjects[id].nome}</td>
                                            <td>{currentSearchedObjects[id].cpf_cnpj}</td>
                                            <td>{currentSearchedObjects[id].banco}</td>
                                            <td>{currentSearchedObjects[id].agencia}-{contactObjects[id].digito_agencia}</td>
                                            <td>{currentSearchedObjects[id].conta_corrente}-{contactObjects[id].digito_conta}</td>
                                            <td>{currentSearchedObjects[id].status}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <div>
                            <Pagination 
                                count={Math.ceil(json_to_array(
                                    currentSearch === "" ? contactObjects : currentSearchedObjects
                                ).length/usersPerPage)} 
                                onChange={(event,page)=>{
                                    setCurrentPage(page); 
                                    setCurrentSearchedObjects(search(contactObjects,currentSearch,page))
                                }}
                            />
                        </div>
                        <Snackbar
                            anchorOrigin={{ vertical:"top", horizontal:"right" }}
                            open={snackbarIsVisible}
                            autoHideDuration={6000}
                            onClose={snackBarOnClose}
                            severity={snackbarSeverity}
                        >
                            <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
            </Grid>
        </>
    );
}

export default Contacts;
