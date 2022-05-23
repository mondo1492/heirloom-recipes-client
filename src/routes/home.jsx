import shakshuka from '../assets/shakshuka.jpg';

function Home() {
    return (
        <div>
            <div className="img-container">
                <img
                    className="d-block w-100"
                    src={shakshuka} 
                    alt={`Image ${1}`}
                />
            </div>
        </div>
    );
}

export default Home;
