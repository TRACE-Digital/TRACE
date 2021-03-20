function Colors() {



function handleClick() {
    //do this when a color is clicked
};

  return (
    <>
      <div className="popup">
            <div className="title">themes</div>
                <div>
                    <ul className="editor">
                        <img className = "color-choices" src={require("assets/img/Coffee.png").default}/>
                        <img className = "color-choices" src={require("assets/img/Blue.png").default}/>
                        <img className = "color-choices" src={require("assets/img/Green.png").default}/>
                        <img className = "color-choices" src={require("assets/img/Pink.png").default}/>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Colors;
