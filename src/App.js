import React from 'react';
import logo from './logo.svg';
import './App.css';
import  GTTS from './GTTS';
import EmployeeDetails from './EmployeeDetails';
import UpdateEmployee from './UpdateEmployee';
import Login from './Login';


var button ='';


class App extends React.Component {

  constructor(props) {
    super(props);
     this.state = { Loggedin: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).Loggedin : false,
   // this.state = { Loggedin: true,
                    temp:null,
                    CurComp: <EmployeeDetails />,
                    user_name: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).user_name : false,
                    Employee_List: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).Employee_List : [],
                    activities_list: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).activities_list :  [],
                  }
  }


onUnload = (event) => {
  sessionStorage.setItem("state", JSON.stringify(this.state))
}
componentDidMount() {
 console.log(sessionStorage.getItem('state'))
 window.addEventListener("beforeunload", this.onUnload)
 //console.log(JSON.parse(sessionStorage.getItem('state')));
}

componentWillUnmount() {
// console.log(sessionStorage.getItem('state'))
  window.removeEventListener("beforeunload", this.onUnload)
  // console.log(sessionStorage.getItem('state'))
}
 
 Logout(){
  sessionStorage.setItem("loaded",false)
  sessionStorage.removeItem('loaded');
  this.setState({ Loggedin: false })
 }

 callbackFunction = (childData,username,EmployeeList,activities) => {
  if( childData ==='true' ){
  this.setState({ Loggedin: childData,user_name: username,Employee_List:EmployeeList,activities_list:activities })
  this.onUnload();
  // console.log("EmployeeList in app.js "+ EmployeeList[0]);
  // var str = EmployeeList.toString();
  // var arr =[]
  // arr =str.split(',')
  // console.log("EmployeeList split "+arr[0]);


  }
  else
  console.log("Else in Callback "+childData);
}

menuchange(menuitem,i){
    this.setState({ CurComp: menuitem })
}

render(){
  
  return (
    <div>
    <div className="App" id="appid" >

      <header className={this.state.Loggedin?"App-header1":"App-header"}>
        <h2 className="header-Text"> GTTS Consolidation <br/></h2>
        {this.state.Loggedin &&  <button  id="submit" className="LogoutButton" value="Login" onClick={() => this.Logout()}>Logout </button>} 
      </header>

  {this.state.Loggedin &&   <div className="Menu">  
          
          <div className="menu-link" id="0" onClick={(e)=>this.menuchange(<GTTS employeelist={this.state.Employee_List} username={this.state.user_name} activitieslist={this.state.activities_list}/>,0,e)}> GTTS</div>
          <div className="menu-link" id="1" onClick={(e)=>this.menuchange(<EmployeeDetails />,1,e)}> Employee Details</div>
          <div className="menu-link" id="2" onClick={(e)=>this.menuchange(<UpdateEmployee />,2,e)}> Update Employee</div>

       </div>}
      {/* Ternary operator */}

{this.state.Loggedin ? 
      <div  className="App-body"> 
        {this.state.CurComp} 
      </div> 
        : <div  className="App-login-body"><Login parentCallback = {this.callbackFunction}/>   </div> }
    </div>
    </div>
  );
}
}
export default App;
