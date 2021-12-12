import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const Folder = () => {

    const [folder, setFolder] = useState("");
    const [list, setList] = useState([]);

    const [status, setStatus] = useState(false)


    const handleSubmit = e => {
        e.preventDefault();
        addFolder(folder)
        if(status===true){
            setStatus(false)
        }
        setFolder("")
    };


    const handleOnChange = e => {
        setFolder(e.target.value);
    };



    const deleteFolder = async folder => {
        try{
            var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };

        const response = await fetch("http://127.0.0.1:5000/folder/" + folder, requestOptions)
        if(response.status===200){
           setStatus(true)
           if(status===true){
               setStatus(false)
           }
        }
               
        }catch (error){
            console.log(error)
        }
        
    };


    const addFolder = async (folder) => {
        try{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "folder": folder
            });
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
    
            const response = await fetch("http://127.0.0.1:5000/folder/", requestOptions);
            if(response.status===200){
                setStatus(true)
            }
        } catch (error) {
            console.log(error, "error")
        }
    }


    useEffect(() => {
        const getData = async () => {
            try {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };
                const response = await fetch("http://127.0.0.1:5000/folder/", requestOptions);
                const responseBody = await response.json();
                setList(responseBody); 
                console.log(responseBody)
            } catch(error) {   
                console.log(error, "error")
            }
        }
        getData()
    }, [status])


    return (
        <div className="card container w-25 mt-5 p-3" >
            <h1>Folders</h1>
            <div>
                <ul className="list-group list-group-flush">
                    {list.map((item, index) => {
                        return (
                            <li key={index} className="list-group-item d-flex">
                                <p className="col-md-5" >{item.folder}</p>
                                <span className="col-md-3">
                                    <Link to={"folder/"+item.folder} ><button onClick={()=>localStorage.setItem("id", item.id)} style={{background: "none", border: "none", color: "blue"}}>View items</button></Link>
                                </span>
                                <span className="col-md-2">
                                <button onClick={() => deleteFolder(item.folder)}  style={{background: "none", border: "none", color: "red"}} >Remove</button>
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <form action="" onSubmit={handleSubmit} className="d-flex mt-2" >
                    <input
                        type="text"
                        placeholder="New Folder"
                        className="form-control"
                        value={folder}
                        onChange={handleOnChange}
                    />
                    <button type="submit" className="btn btn-dark mx-3" >Add</button>
                </form>
            </div>
        </div>
    );
};

export default Folder
