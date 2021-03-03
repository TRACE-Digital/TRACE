import React from "react";

function Results() {

function close(){
    return null;
}

const handleClick = (e) => {
    console.log("A setting would be saved here");
};

  return (
    <>
      <div className="popup">
        <span className="x" onClick={close}><i className="icon fas fa-times"></i></span>
            <div className="title">themes</div>
                <div>
                    <ul className="editor">
                        <li className="editor-popup">
                            name color:
                            <i class="fas fa-circle red" onClick={handleClick}></i>
                            <i class="fas fa-circle orange" onClick={handleClick}></i>
                            <i class="fas fa-circle yellow" onClick={handleClick}></i>
                            <i class="fas fa-circle green" onClick={handleClick}></i>
                            <i class="fas fa-circle blue" onClick={handleClick}></i>
                            <i class="fas fa-circle purple" onClick={handleClick}></i>
                        </li>
                        <li className="editor-popup"> 
                            box colors:
                            <i class="fas fa-circle red" onClick={handleClick}></i>
                            <i class="fas fa-circle orange" onClick={handleClick}></i>
                            <i class="fas fa-circle yellow" onClick={handleClick}></i>
                            <i class="fas fa-circle green" onClick={handleClick}></i>
                            <i class="fas fa-circle blue" onClick={handleClick}></i>
                            <i class="fas fa-circle purple" onClick={handleClick}></i>
                        </li>
                        <li className="editor-popup">
                            background color:
                            <i class="fas fa-circle red" onClick={handleClick}></i>
                            <i class="fas fa-circle orange" onClick={handleClick}></i>
                            <i class="fas fa-circle yellow" onClick={handleClick}></i>
                            <i class="fas fa-circle green" onClick={handleClick}></i>
                            <i class="fas fa-circle blue" onClick={handleClick}></i>
                            <i class="fas fa-circle purple" onClick={handleClick}></i>
                        </li>
                        <li className="editor-popup">
                            other styles etc:
                            <i class="fas fa-circle red" onClick={handleClick}></i>
                            <i class="fas fa-circle orange" onClick={handleClick}></i>
                            <i class="fas fa-circle yellow" onClick={handleClick}></i>
                            <i class="fas fa-circle green" onClick={handleClick}></i>
                            <i class="fas fa-circle blue" onClick={handleClick}></i>
                            <i class="fas fa-circle purple" onClick={handleClick}></i>
                        </li>
                    </ul>  
                </div>
            </div>
        </>
    );
}

export default Results;