const TruongComponent = () => {
  // jsx = html + js => 1 block
  const name = "Hoi dan IT";
  const age = 22;

  const info = {
    name: "Truong",
    age: 22,
  };

  const arr = [1, 2, 3, true, false, { name: "truong" }];

  return (
    <div>
      <h1
        style={{
          color: "red",
          fontSize: "30px",
        }}
      >
        Hello: {JSON.stringify(arr)}
      </h1>
      {/* <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      /> */}
      <ul>
        <li>Invent new traffic lights </li>
        <li>Rehearse a movie scene </li>
        <li>Improve the spectrum technology</li>
      </ul>
    </div>
  );
};

export default TruongComponent;
