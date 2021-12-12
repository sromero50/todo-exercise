import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
const ToDo = () => {

    const id = parseInt(localStorage.getItem("id"))
    const params = useParams()
    const navigate = useNavigate();


    const [toDo, setToDo] = useState("");
    const [list, setList] = useState([]);


    const [status, setStatus] = useState(false)


    const handleSubmit = e => {
        e.preventDefault();
        addTask(toDo)
        setToDo("");
        setStatus(false)
    };

    const handleOnChange = e => {
        setToDo(e.target.value);
    };


    const addTask = async (task) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "task": task,
                "id_folder": id
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("http://127.0.0.1:5000/task/", requestOptions);
            if (response.status === 200) {
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
                const response = await fetch("http://127.0.0.1:5000/task/", requestOptions);
                const responseBody = await response.json();
                setList(responseBody);
                console.log(responseBody)
            } catch (error) {
                console.log(error, "error")
            }
        }
        getData()
    }, [status])

    const goEdit = (id, task) => {
        navigate('/edit', { state: { id: id, task: task, folder: params.name } });
    }


    return (
        <div className="card container w-25 mt-5 p-3" >
            <h1> <Link style={{textDecoration: "none", color: "white"}} to={"/"}><button style={{ background: "none", border: "none", fontWeight: "bold" }} >Folders</button></Link> {">"} {params.name} </h1>
            <div>
                <ul className="list-group list-group-flush">
                    {list.map(item => {
                        return (<>
                            {id === item.id_folder
                                ? (<li key={item.id} className="list-group-item d-flex">
                                    <div className="col-md-5" >
                                        <input type="checkbox" name={item.id} id={item.id} />
                                        <label className="ms-1" htmlFor={item.id} > {item.task}</label>
                                    </div>
                                    <span className="col-md-3">
                                        <button style={{border: "none", background: "none", color : "blue"}} ><a onClick={() => { goEdit(item.id, item.task) }} >Edit</a></button>
                                    </span>
                                </li>)
                                : null
                            }
                        </>
                        );
                    })}
                </ul>
                <form action="" onSubmit={handleSubmit} className="d-flex mt-2" >
                    <input
                        type="text"
                        placeholder="New Task"
                        className="form-control"
                        value={toDo}
                        onChange={handleOnChange}
                    />
                    <button type="submit" className="btn btn-dark mx-3" >Add</button>
                </form>
            </div>
        </div>
    );
}

export default ToDo
