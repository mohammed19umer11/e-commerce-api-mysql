export default function (err) {
    console.log('ENTERING ERROR HANDLER CLASS');
    console.log(err);
    let error = new Error(err);
    error.status = 500;
    //CONNECTION ERROR
    if(err.code==='ECONNREFUSED'){             
        error.message = 'Internel Server Error'
        console.log('SQL CONNECTION ERROR');
        console.log(err);
        return error; 
        //return will return the error object
        //throw will throw the error and crash the app unless catched and dealt with
    }
    else if(err.code==='ER_PARSE_ERROR'){
        error.message = 'Internel Server Error'
        console.log('QUERY ERROR');
        console.log(err);
        return error;
    }
    else if(err.code==='ER_DUP_ENTRY'){
        error.message = 'Email already exist'
        error.status = 400;
        console.log('DUPLICATE ENTRY ERROR');
        console.log(err);
        return error;
    }
    else if(err.code ==='ER_BAD_FIELD_ERROR'){
        error.message = 'Internel Server Error'
        console.log('QUERY ERROR');
        console.log(err);
        return error;
    }
    else {
        console.log('UNKNOWN ERROR');
        console.log(err);
        return error
    }
    
}