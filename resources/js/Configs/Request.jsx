import axios from "axios";
import { Routes } from "./Routes"; 

// Make post request 
const post = async (key, data, params = null) => { 
    try {
        let route = Routes[key] ?? null;
        if (!route) { 
            throw "Invalid route key"  
        } 
        for (let key in params) {
            let search = new RegExp(":"+key, "gi");  
            route = route.replace(search, params[key]);
        }
        const response = await axios.post(
            route,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return format(response);
    } catch (error) { 
        return format(null, error);
    }
}

const put = async (key, data, params) => {
    let r_data = data ?? {};
    r_data._method = "put";
    return await post(key, r_data, params);
}

const format = (response, error = null) => {
    const formatedResponse = {};
    console.log(response);
    let validationMsg = [];
    if (error) { 
        response = error?.response; 
        console.log(response);
        if (response?.data?.errors &&  Object.keys(response?.data?.errors).length > 0) {
            let validationErrors = response.data.errors;
            for (let key in validationErrors) {
                if(Array.isArray(validationErrors[key])) {
                    validationMsg = [...validationMsg, ...validationErrors[key].flat()]; 
                } else {
                    validationMsg.push(validationErrors[key]);
                }
            }
        }
    } 
    let msg = null;
    if (validationMsg.length > 0) {
        msg = validationMsg;
    } else {
        msg = response?.data?.msg ?? response?.statusText;
        if (!msg) {
            msg = "Something went wrong!!";
        }
    }
    
    formatedResponse.message = msg; 
    formatedResponse.data = response?.data ?? []; 
    formatedResponse.is_success = error  ? false :  true;
    return formatedResponse;
}


//Make Get request  
const get = async (key, params = null) => {
    try {
        let route = Routes[key] ?? null;
        if (!route) { 
            throw "Invalid route key"  
        } 
        let extraParam = {};
        for (let key in params) {
            let search = new RegExp(":" + key, "gi");  
            if (search.test(params[key])) {
                route = route.replace(search, params[key]);
            } else { 
                extraParam[key] = params[key];
            }
        }
        const response = await axios.get(
            route,
            extraParam,
        );
        return format(response);
    } catch (error) { 
        return format(null, error);
    }
}


export {
    post,
    put,
    get,
};