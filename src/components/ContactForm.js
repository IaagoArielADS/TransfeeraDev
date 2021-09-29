import React, { useState, useEffect } from "react";
import { get_json_by_value } from "../sort";
import { Button } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import { DialogTitle, DialogContent, DialogActions } from "@material-ui/core"
import { Typography } from "@material-ui/core"
import DeleteForever from '@material-ui/icons/DeleteForever'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { json_to_array } from "../sort";
import firebaseDb from "../firebase";
import { validateForm } from "../validate";
import * as schema from '../schema.json'

const ContactForm = (props) => {
    const initialFieldValues = {
        nome: '',
        cpf_cnpj: '',
        email: '',
        banco: '',
        agencia: '',
        digito_agencia: '',
        tipo_conta:'',
        conta_corrente:'',
        digito_conta:'',
        status:'RASCUNHO'
    }

    const InputLabelStyle = {fontSize:"0.75em"}

    var [values, setValues] = useState(initialFieldValues)
    var [fieldErrors, setFieldErrors] = useState({})

    useEffect(() => {
        if (props.currentId == '')
            setValues({
                ...initialFieldValues
            })
        else{
            setValues({
                ...get_json_by_value(props.contactObjects,"firebaseId",props.currentId)
            })
        }
        props.setModalIsOpen(props.modalIsOpen)
    }, [props.currentId, props.contactObjects])

    const handleInputChange = e => {
        var { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        if(validateForm(values, fieldErrors, (arg)=>setFieldErrors(arg))){
            props.addOrEdit(values)
            props.setModalIsOpen(false)
        }
    }

    const getAutocompleteOptions = e => {
        let initData=[]
        firebaseDb.child('bancos').on('value', snapshot => {
            if (snapshot.val() != null)
                initData.push(snapshot.val())
        })
        initData = json_to_array(initData["0"])
        .map((json)=>{
            return {label:json.nome}
        })
        return initData
    }

    const handleBanco = ({ target }, fieldName) => {
        const { value } = target;
        switch (fieldName) {
            case 'banco':
                setValues({...values,...{banco:value}})
                break;
            case 'tipo_conta':
                setValues({...values,...{tipo_conta:value}})
                break;
          default:
        }
      };

    return (
        <Dialog 
            style={{backgroundColor:"#ffffff"}}
            open={props.modalIsOpen}
        >
            <DialogContent 
                style={{backgroundColor:"#ffffff", opacity:1}}
            >
                <Grid container>
                    <Grid container xs={12} justifyContent="space-between">
                        <Grid xs={11} item>
                            <DialogTitle>{values.nome}</DialogTitle>
                        </Grid>
                        <Grid xs={1} item>
                            <Button onClick={()=>props.setModalIsOpen(false)}>
                                <CloseIcon/>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <Grid 
                            xs={2} 
                            textAlign="center"
                            style={{
                            borderRadius:30, 
                            backgroundColor:values.status === "VALIDADO"?"#2299ff":"#ccc"
                        }}>
                            {values.status}
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <Typography variant="h5">
                            Quais os dados do favorecido?
                        </Typography>
                    </Grid>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={8}>
                            <InputLabel style={InputLabelStyle}>
                                Qual o nome completo ou razão social do favorecido?
                            </InputLabel>
                            <TextField
                                error={fieldErrors.nome}
                                size="small"
                                readOnly={values.status === "VALIDADO"}
                                fullWidth
                                style={{height:"40px", marginTop:"7px"}}
                                required
                                defaultValue={values.nome}
                                onChange={handleInputChange}
                                name="nome"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel style={InputLabelStyle}>Qual o CPF ou CNPJ?</InputLabel>
                            <TextField
                                error={fieldErrors.cpf_cnpj}
                                size="small"
                                readOnly={values.status === "VALIDADO"}
                                fullWidth={true}
                                style={{marginTop:"7px"}}
                                required={true}
                                defaultValue={values.cpf_cnpj}
                                onChange={handleInputChange}
                                name="cpf_cnpj"
                            />
                        </Grid>
                    </Grid>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={8}>
                            <InputLabel style={InputLabelStyle}>Qual o email do favorecido?</InputLabel>
                            <TextField
                                error={fieldErrors.email}
                                size="small"
                                fullWidth={true}
                                style={{marginTop:"7px"}}
                                required={true}
                                defaultValue={values.email}
                                onChange={handleInputChange}
                                name="email"
                            />
                        </Grid>
                    </Grid>
                    <Grid container xs={12}>
                        <Typography variant="h5">
                            Quais os dados bancários do favorecido?
                        </Typography>
                    </Grid>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={7}>
                            <InputLabel style={InputLabelStyle}>Qual o banco do favorecido?</InputLabel>
                            <Autocomplete
                                required={true}
                                defaultValue={values.banco}
                                onChange={handleInputChange}
                                onSelect={(event)=>{
                                    if(values.status !== "VALIDADO")
                                        handleBanco(event, 'banco')
                                    
                                }}
                                name="banco"
                                options={getAutocompleteOptions()}
                                size="small"
                                renderInput={(params) => 
                                    <TextField 
                                        style={{height:"40px", marginTop:"7px"}} 
                                        {...params}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel style={InputLabelStyle}>Qual a agência do favorecido?</InputLabel>
                            <TextField
                                error={fieldErrors.agencia}
                                size="small"
                                required={true}
                                inputProps={{
                                    maxLength: 4,
                                    pattern:
                                        values.banco==="Banco do Brasil (001)"?
                                        schema["Banco do Brasil (001)"].agency.pattern:
                                        schema["Outros"].agency.pattern
                                }}
                                readOnly={values.status === "VALIDADO"}
                                fullWidth={true}
                                style={{height:"40px", marginTop:"7px"}}
                                required={true}
                                defaultValue={values.agencia}
                                onChange={handleInputChange}
                                name={"agencia"}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <InputLabel style={InputLabelStyle}>Dígito</InputLabel>
                            <TextField
                                error={fieldErrors.digito_agencia}
                                size="small"
                                inputProps={{
                                    maxLength:1,
                                    pattern:
                                    values.banco==="Banco do Brasil (001)"?
                                    schema["Banco do Brasil (001)"].agency.digit.pattern:
                                    schema["Outros"].agency.digit.pattern
                                }}
                                readOnly={values.status === "VALIDADO"}
                                fullWidth={true}
                                style={{height:"40px", marginTop:"7px"}}
                                required={true}
                                defaultValue={values.digito_agencia}
                                onChange={handleInputChange}
                                name={"digito_agencia"}
                            />
                        </Grid>
                    </Grid>
                    <Grid container xs={12} spacing={1}>
                        <Grid item xs={7}>
                            <InputLabel style={InputLabelStyle}>Qual o tipo da conta?</InputLabel>
                            <Autocomplete
                                style={{height:"5px"}}
                                required={true}
                                defaultValue={values.tipo_conta}
                                onChange={handleInputChange}
                                onSelect={(event)=>{
                                    if(values.status !== "VALIDADO")
                                        handleBanco(event, 'tipo_conta')
                                }}
                                name="tipo_conta"
                                options={
                                    (values.banco=== "Banco do Brasil (001)"?
                                    schema["Banco do Brasil (001)"].accountType.allowedTypes:
                                    schema["Outros"].accountType.allowedTypes)
                                }
                                size="small"
                                renderInput={(params) => 
                                    <TextField 
                                        style={{height:"40px", marginTop:"7px"}} 
                                        {...params} 
                                         />
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel style={InputLabelStyle}>Qual a conta corrente?</InputLabel>
                            <TextField
                                error={fieldErrors.conta_corrente}
                                size="small"
                                inputProps={{
                                    maxLength: values.banco==="Banco do Brasil (001)"?8:4,
                                    pattern:values.banco==="Banco do Brasil (001)"?"/^(?:^0*)[1-9][0-9]{0,7}$/":"/^(?:^0*)[1-9][0-9]{0,10}$/"
                                }}
                                readOnly={values.status === "VALIDADO"}
                                fullWidth={true}
                                style={{height:"40px", marginTop:"7px"}}
                                required={true}
                                defaultValue={values.conta_corrente}
                                onChange={handleInputChange}
                                name="conta_corrente"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <InputLabel style={InputLabelStyle}>Dígito</InputLabel>
                            <TextField
                                error={fieldErrors.digito_conta}
                                size="small"
                                inputProps={{
                                    maxLength:1,
                                    pattern:"/^[xX0-9]{0,1}$/"
                                }}
                                readOnly={values.status === "VALIDADO"}
                                fullWidth={true}
                                style={{height:"40px", marginTop:"7px"}}
                                required={true}
                                defaultValue={values.digito_conta}
                                onChange={handleInputChange}
                                name="digito_conta"
                            />
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <DialogActions>
                            <Grid container justifyContent="space-between">
                                <Grid xs={2}>
                                    <Button onClick={()=>props.setModalIsOpen(false)}>
                                        Voltar
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button style={{display:props.currentId === "" ? "none" : ""}} onClick={()=>props.deleteFromModal()}>
                                        <DeleteForever style={{fontSize:"2em", backgroundColor:"#d32f2f", color:"white"}}/>
                                    </Button>
                                    <Button onClick={handleFormSubmit}>
                                        {props.currentId == '' ? "Salvar" : "Atualizar"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default ContactForm;