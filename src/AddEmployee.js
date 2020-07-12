import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


  class AddEmployee extends React.Component  {
    constructor(props) {
      super(props);
      this.state = { 
                  empdetails: [],
                  activitydetails:[],
                  showadd:true,
                  showupdate:false,
                  showview:false,
                  employeelist:[],
                  errormsg:'',
                  viewupdate:false,
                  labellist:["Employee Id :","First Name :","Last Name :","Mail id :","Contact Number :","Location :","Designation :","Manager :","Last working day :","Date of joining :"],
                  inptidlist:["EmpId","EmpFirstName","EmpLastName","EmpMail","contact","Location","Designation","Manager","LWD","DOJ"],
                  errorslist:{},

       }
       
  }
    

    componentDidMount(){
      var result;
      let formdata =new FormData();  
      formdata.append('filename',"EmployeeData");
      axios.post("http://localhost:8002/getempdata",formdata)
          .then(res=>{  
            result=   res.data;
            console.log("status text",res.data);
            console.log("data from file text",result.Employee);

          var EmployeeList=[];
          var EmpEmailList={};
          var ActivityList=[];
           result.Employee.map((emp)=>{
               EmployeeList.push(emp.EmpFirstName);
              // EmpEmailList[emp.EmpFirstName]=emp.EmpMail;

           });
          result.Activity.map((act)=>{
              ActivityList.push(act);
          });

            this.setState({empdetails:result.Employee,activitydetails:ActivityList,employeelist:EmployeeList});

          })

    }

  
    addemployee(e){
      var EmpId = document.getElementById("EmpId").value;
      var EmpFirstName = document.getElementById("EmpFirstName").value;
      var EmpLastName = document.getElementById("EmpLastName").value;
      var EmpMail = document.getElementById("EmpMail").value;
      var contact = document.getElementById("contact").value;
      var Location = document.getElementById("Location").value;
      var Designation = document.getElementById("Designation").value;
      var Manager = document.getElementById("Manager").value;
      var LWD = document.getElementById("LWD").value;
      var DOJ = document.getElementById("DOJ").value;
      var EmpNmae = EmpFirstName+' '+ EmpLastName;
      var Account= "strategics account";
      var project = "F&A";
      var ManagerMail =  "suresh.B@outlook";
      var ManagerContact = "289382989";
      var Hold = false ;

      if( EmpId==='' || EmpFirstName ===''|| EmpLastName ===''||EmpMail ===''||contact ===''||Location ===''||Designation ===''||Manager ===''||LWD ===''||DOJ ===''){
        
        this.setState({errormsg:"Enter All details"});
        console.log("error")
      }
      else{

      var newempdata ={};
      newempdata["EmpId"]= EmpId;
      newempdata["EmpFirstName"]= EmpFirstName;
      newempdata["EmpLastName"]= EmpLastName;
      newempdata["EmpNmae"]= EmpNmae;
      newempdata["EmpMail"]= EmpMail;
      newempdata["LWD"]= LWD;
      newempdata["Designation"]= Designation;
      newempdata["contact"]= contact;
      newempdata["Location"]= Location;
      newempdata["DOJ"]= DOJ;
      newempdata["Account"]= Account;
      newempdata["project"]= project;
      newempdata["Manager"]= Manager;
      newempdata["ManagerMail"]= ManagerMail;
      newempdata["ManagerContact"]= ManagerContact;
      newempdata["Hold"]= Hold;

      var empdetls = this.state.empdetails;
      empdetls.push(newempdata);
      //console.log("empdetails",empdetls);
      var EmployeeList=[];
      empdetls.map((emp)=>{
           EmployeeList.push(emp.EmpFirstName);
       });
      this.setState({empdetails:empdetls,employeelist:EmployeeList})
      var tempfulljson = {};
      Object.assign(tempfulljson, {"Employee": empdetls})
      Object.assign(tempfulljson, {"Activity": this.state.activitydetails})
      let formdata =new FormData();  
      var result;
      formdata.append('filename',"EmployeeData");
      formdata.append('jsondata',JSON.stringify(tempfulljson));
      axios.post("http://localhost:8002/addEmployee",formdata)
          .then(res=>{  
            result=   res.data;
            console.log("status text",res.statusText);
            if(res.statusText==="OK"){
               document.getElementById("EmpId").value ='';
               document.getElementById("EmpFirstName").value='';
               document.getElementById("EmpLastName").value='';
               document.getElementById("EmpMail").value='';
                document.getElementById("contact").value='';
               document.getElementById("Location").value='';
               document.getElementById("Designation").value='';
               //document.getElementById("Manager").value;
               document.getElementById("LWD").value='';
                document.getElementById("DOJ").value='';
            }
          
          })
        }

    }

    handleinpt(e,id){
      var errorloop =this.state.errorslist;
     var  Characters  = /^[a-zA-Z]+$/;
     var date =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
     var validEmailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if(id==="EmpId"){
           if(isNaN(e.target.value)|| e.target.value<999999 || e.target.value>9999999 ){  
             if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter correct Employee ID"};
             this.setState({errormsg:"Enter correct Employee ID",errorslist:errorloop})
            } 
            else { 
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})
            }
        }
        if( id==="EmpFirstName" ){
          if( e.target.value.length<4  ){
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Employee First Name Should be more than 3 characters"};
              this.setState({errormsg:`Employee First Name Should be more than 3 characters`,errorslist:errorloop})}     
          else {  
            if(!e.target.value.match(Characters)){  
              if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter only Characters"};
              this.setState({errormsg:`Enter only Characters`,errorslist:errorloop})} 
            else {
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})} }
        }
        if(id==="EmpLastName"){
          if( e.target.value.length<4  ){
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Employee Last Name Should be more than 3 characters"};
              this.setState({errormsg:`Employee Last Name Should be more than 3 characters`,errorslist:errorloop})}     
          else {  
            if(!e.target.value.match(Characters)){  
              if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter only Characters"};
              this.setState({errormsg:`Enter only Characters`,errorslist:errorloop})} 
            else {
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})} }
        }
        if(id==="EmpMail"){
           if(!e.target.value.match(validEmailRegex)){  
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter correct Email format"};
             this.setState({errormsg:`Enter correct Email format`,errorslist:errorloop})} 
             else {
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
               this.setState({errormsg:"",errorslist:errorloop})} 

        }
        if(id==="contact"){
          if(isNaN(e.target.value)|| e.target.value<999999999 || e.target.value>9999999999 ){  
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter correct Contact Details"};
            this.setState({errormsg:"Enter correct Contact Details",errorslist:errorloop})} 
            else {  
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})}
        }
        if( id==="Location"){
          if( e.target.value.length<4  ){
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Location Should be more than 3 characters"};
              this.setState({errormsg:`Location Should be more than 3 characters`,errorslist:errorloop})}     
          else {  
            if(!e.target.value.match(Characters)){  
              if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter only Characters"};
              this.setState({errormsg:`Enter only Characters`,errorslist:errorloop})} 
            else {
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})} }
        }  
        if( id==="Designation"){
          if( e.target.value.length<4  ){
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Designation Should be more than 3 characters"};
              this.setState({errormsg:`Designation Should be more than 3 characters`,errorslist:errorloop})}     
          else {  
            if(!e.target.value.match(Characters)){  
              if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Enter only Characters"};
              this.setState({errormsg:`Enter only Characters`,errorslist:errorloop})} 
            else {
              if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
              this.setState({errormsg:"",errorslist:errorloop})} }
        }
        if(id==="LWD"){
          if(e.target.value==='' ){ 
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Select Date"};
             this.setState({errormsg:`Select Date`})} 
             else {
               this.setState({errormsg:""})} 
        }
        if(id==="DOJ"){
          if(e.target.value===''){  
            if(!errorloop.hasOwnProperty(id)){ errorloop[id]="Select Date"};
            this.setState({errormsg:`Select Date`,errorslist:errorloop})} 
          else {
            if(errorloop.hasOwnProperty(id)){ delete errorloop[id];};
            this.setState({errormsg:"",errorslist:errorloop})} 
          
        }
    }
   
   
  
      render(){
        var values = Object.values(this.state.errorslist);
    return (
    <div className="AppAddEmployee">

                  <div> 
                     <table >
                          <tr>  <td> <label><b>Employee Id :</b></label></td> <td>  <input type="text" id="EmpId" autocomplete="off"  maxlength="7" placeholder="Enter Employee Id" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"EmpId")} />    </td>
                            <td> <label><b>First Name :</b></label></td> <td>  <input type="text" id="EmpFirstName" autocomplete="off" placeholder="Enter First Name" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"EmpFirstName")} /></td></tr>
                          <tr>  <td> <label><b>Last Name :</b></label></td> <td>  <input type="text" id="EmpLastName" autocomplete="off" placeholder="Enter Last Name" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"EmpLastName")} /></td>
                            <td> <label><b>Mail id :</b></label></td><td>  <input type="text" id="EmpMail" autocomplete="off" placeholder="Enter Email Id" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"EmpMail")} />  </td></tr> 
                          <tr>  <td> <label><b>Contact Number :</b></label></td><td>  <input type="text" id="contact" maxlength="10"  placeholder="Enter Contact" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} autocomplete="off" onBlur={(e)=>this.handleinpt(e,"contact")} /> </td>
                            <td> <label><b>Location :</b></label></td><td>  <input type="text" id="Location" autocomplete="off" placeholder="Enter Location"  onBlur={(e)=>this.handleinpt(e,"Location")} />  </td></tr>
                          <tr>  <td> <label><b>Designation :</b></label></td><td>  <input type="text" id="Designation" autocomplete="off"  placeholder="Enter Designation" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }}  onBlur={(e)=>this.handleinpt(e,"Designation")} />  </td>
                            <td> <label><b>Manager :</b></label></td><td>  <input type="text" id="Manager" value="Suresh"autocomplete="off"  placeholder="Enter Manager Name" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} disabled={true}/>  </td></tr> 
                          <tr>  <td> <label><b>Last working day :</b></label></td><td>  <input type="date" id="LWD" autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"LWD")}/> </td>
                          <td> <label><b>Date of joining :</b></label></td><td>  <input type="date" id="DOJ" autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} onBlur={(e)=>this.handleinpt(e,"DOJ")}/>  </td></tr>
                      </table>
                         <button className="empaddsubmit btn btn-primary" onClick={(e)=>this.addemployee(e)} disabled={values.length>0} >Submit</button>
                      {values.length>0 &&   <div className="alert alert-danger" role="alert" > {values[0]}</div>}
                 </div>
     
    </div>
  )}
}

export default AddEmployee;



