//method    url     data


/**
 * 封装fetch
 * params：
 *      method：请求方式     string    必填
 *                  GET     POST    PUT     DELETE
 *      url：地址  string      必填
 *      data：数据     对象      非必填
 *      Object.keys{{}}         可以获取到对象的属性
 *
 *      let token = sessionStorage.setItem('token');
 *      1.api(get,'')
 *      2.api(get,'',{})
 *      3.api(get,'api/cate',{page:10,limit:10})        api/cate/page=10&limit=10
 *
 *
 */
import {SUCCESS,HOSTNAME} from "./base";

function api(method,url,data){
    //转为大写 去空格
    method = method.toUpperCase().trim();


    let headers = {
        token:sessionStorage.getItem('token')
    };
    let option = {
        method,
        headers
    };
    //datas
    //GET  DELETE  =>headers
    if (method ==='GET' && data && Object.keys(data).length){
        let str = '?';
        for (let i in data){
            str += `${i}=${data[i]}&`;
        }
        str = str.slice(0,-1);
        url += str;
    }
    url = HOSTNAME + url;
    if (method === 'POST' || method === 'PUT'){
        let body = JSON.stringify(data);
        headers['Content-type'] = 'application/json';
        option.body = body;
    }
    option.headers = headers;



    let promise = new Promise((resolve,reject)=>{
        fetch(url,option).then(res=>res.json())
            .then(data=>{
                let {code} = data;
                if (code == SUCCESS){
                    resolve(data);
                } else {
                    reject(data);
                }
            })
    });
    return promise;
}
export {api};