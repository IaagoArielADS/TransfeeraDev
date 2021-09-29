import * as schema from './schema.json'

export function validateForm(form, fieldErrors, setFieldErrors){
    let banco = form.banco
    if(banco !== "Banco do Brasil (001)"){
        banco = "Outros"
    }
    const sch = schema["default"]
    const agency_pattern = retrieveRegExp(sch[banco].agency.pattern)
    const account_pattern = retrieveRegExp(sch[banco].account.pattern)
    const agency_digit_pattern = retrieveRegExp(sch[banco].agency.digit.pattern)
    const account_digit_pattern = retrieveRegExp(sch[banco].account.digit.pattern)

    let response = {...fieldErrors}

    // Testing for NOT NULL
    
    if(form.nome===""){
        setFieldErrors({
            ...response,
            ...{nome:true}
        })
        return false;
    } else {
        response = {
            ...response,
            ...{nome:false}
        }
    }
    
    if(form.cpf_cnpj===""){
        setFieldErrors({
            ...response,
            ...{cpf_cnpj:true}
        })
        return false;
    } else {
        response = {
            ...response,
            ...{cpf_cnpj:false}
        }
    }

    if(form.email===""){
        setFieldErrors({
            ...response,
            ...{email:true}
        })
        return false;
    } else {
        response = {
            ...response,
            ...{email:false}
        }
    }

    // Testing REGEXP patterns

    if(!agency_pattern.test(form.agencia) || form.agencia===""){
        setFieldErrors({
            ...response,
            ...{agencia:true}
        })
        return false;
    }else{
        response= {
            ...response,
            ...{agencia:false}
        }
    }

    if(!agency_digit_pattern.test(form.digito_agencia) || form.digito_agencia===""){
        setFieldErrors({
            ...response,
            ...{digito_agencia:true}
        })
        return false;
    }else{
        response = {
            ...response,
            ...{digito_agencia:false}
        }
    }

    if(!account_pattern.test(form.conta_corrente) || form.conta_corrente===""){
        setFieldErrors({
            ...response,
            ...{conta_corrente:true}
        })
        return false;
    }else{
        response = {
            ...response,
            ...{conta_corrente:false}
        }
    }

    if(!account_digit_pattern.test(form.digito_conta) || form.digito_conta===""){
        setFieldErrors({
            ...response,
            ...{digito_conta:true
        }})
        return false;
    }else{
        setFieldErrors({
            ...response,
            ...{digito_conta:false}
        })
    }

    return true
}

// Use this function instead of new RegExp(<String>), cuz for some reason some symbols might end messed up
function retrieveRegExp(str){
    var lastSlash = str.lastIndexOf("/");
    return new RegExp(str.slice(1, lastSlash), str.slice(lastSlash + 1));
}