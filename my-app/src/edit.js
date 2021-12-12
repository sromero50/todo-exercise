import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

const Edit = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [edit, setEdit] = useState(location.state.task);

    const handleSubmit = e => {
        e.preventDefault();
        setEdit(edit);
        if (edit) {
            editTask(edit)
        }

    };
    const handleOnChange = e => {
        setEdit(e.target.value);
    };


    const editTask = async (task) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                task: task
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("http://127.0.0.1:5000/task/" + location.state.id, requestOptions);
            if(response.status === 200){
                navigate('/folder/'+location.state.folder)
            }


        } catch (error) {
            console.log(error, "error")
        }

    }

    return (
        <div className="card container w-25 mt-5 p-3" >
            <h1>Editing Task "{location.state.task}" </h1>
            <form action="" onSubmit={handleSubmit} className="mt-2" >
                <div  >
                    <input
                        type="text"
                        className="form-control"
                        value={edit}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="mt-4" >
                    <button type="submit" className="btn btn-dark me-3 w-25" >Save</button>
                    <Link style={{textDecoration: "none", color: "white"}} to={"/folder/"+location.state.folder}><button type="button" className="btn btn-dark w-25" >Cancel</button></Link>
                </div>
            </form>
        </div>
    );
}

export default Edit
