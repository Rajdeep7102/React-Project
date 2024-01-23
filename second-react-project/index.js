function Header(){
    return (
        <header>
            <nav className="nav">
                <h1>This is header component</h1>
                <ul className="nav-items">
                    <li>Pricing</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </nav>
        </header>
    )
}


function Main(){
    return(<main>
        <h1>Amazing React Facts</h1>
        <ul className="nav-items">
            <li>Was first released in 2013</li>
            <li>Was originally created by Jordan</li>
            <li>Maintained by Facebook</li>
        </ul>
    </main> 
    )

}
function Navbar(){
    return (
        <nav>
            <img src="E:\React\second-react-project\components\Rajdeep Signature.png" className="nav--icon" />
            <h3 className="nav--logo_text">ReactFacts</h3>
            <h4 className="nav--title">React Course - Project 1</h4>
        </nav> 
    )
}

function App(){
    return ( 
        <div className="container">
            <Header />
            <Navbar />
            <Main />
        </div>
    )
}


const root = ReactDOM.createRoot(<App />,document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)