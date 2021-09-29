export function sorting(list, key){
    for(let el in list){
        list[el].firebaseId=el
    }
    var arr = json_to_array(list)
    arr = sort_by_key(arr, key)
    return array_to_json(arr)
}

export function search(list, search, page){
    var arr = json_to_array(list)
    var filtered = sort_by_key(arr, 'nome')
    if(search !== "")
        filtered = arr.filter(obj =>  
            obj.nome.toUpperCase().includes(search.toUpperCase()) ||
            obj.cpf_cnpj.includes(search) ||
            obj.agencia.includes(search) ||
            obj.conta_corrente.includes(search)
        );
    filtered = filtered.slice(10*(page-1),Math.min(10*page,filtered.length))
    filtered = array_to_json(filtered)
    return array_to_json(filtered)
}

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

export function json_to_array(json){
    var arr =[];
    for(let id in json){
        arr.push(json[id])
    }
    return arr;
}

export function array_to_json(arr){
    return Object.assign({}, arr);
}

export function get_json_by_value(json,key,value){
    let numberOfItems = Object.keys(json).length
    for(let i=0; i<numberOfItems; i++){
        if(json[i][key] === value)
            return json[i]
    }
}