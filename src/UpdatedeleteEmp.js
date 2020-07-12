import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


  class UpdatedeleteEmp extends React.Component  {
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

   
    updateemployee(e){

      var tempfulljson = {};
      Object.assign(tempfulljson, {"Employee": this.state.empdetails})
      Object.assign(tempfulljson, {"Activity": this.state.activitydetails})
      let formdata =new FormData();  
      var result;
      formdata.append('filename',"EmployeeData");
      formdata.append('jsondata',JSON.stringify(tempfulljson));
      axios.post("http://localhost:8002/addEmployee",formdata)
          .then(res=>{  
            result=   res.data;
            console.log("status text",res.statusText);
          
          })

    }
    handleemployee(e,id){
        var empde = this.state.empdetails;
     this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
          return    emp[id]= e.target.value;
      }       
      })
      console.log("update",this.state.empdetails);
      this.setState({empdetails:this.state.empdetails})
    }
    deleteemployee(){
            
        var empde = this.state.empdetails;
        empde.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
               delete empde[index];
         }       
         })
         var res= empde.filter((emp)=> emp !== null     )  
         var EmployeeList=[];
         res.map((emp)=>{
              EmployeeList.push(emp.EmpFirstName);
             // EmpEmailList[emp.EmpFirstName]=emp.EmpMail;

          });
         this.setState({empdetails:res,viewupdate:false,employeelist:EmployeeList},()=>{
            this.updateemployee();
          })
       }
      
    

    onnameselect(e){ 
  
      if(e.target.value==='Select User'){
        this.setState({errormsg:'Please Select User',viewupdate:false});
      }else{
      console.log("selected EMP: ",e.target.value)
      this.setState({viewupdate:true,errormsg:'',});
      }
    }
    
   
  
      render(){
        //console.log("this.state.empdetails",this.state.empdetails)
  
    return (
    <div className="AppUpdatedeleteEmp">
      
                 <div> 
                <select id="getemp" className="dropdown__select" onChange={(e)=>this.onnameselect(e)} >
              <option class="placeholder">Select User</option>
                  { this.state.employeelist.map((emp,index)=>  <option className="select-option" value={emp}>{emp}</option> )}
              </select>
                  {this.state.errormsg &&   <span className="alert alert-danger" role="alert" > {this.state.errormsg}</span>}
                  {this.state.viewupdate &&    <div>  {this.state.empdetails.map((emp,index)=>{ if(emp.EmpFirstName === document.getElementById('getemp').value){ 
                        return <table key={index}>
                       
                      {this.state.inptidlist.map((id,index)=>{
                        return  <tr> 
                                   <td> 
                                     <label>
                                       <b>{this.state.labellist[index]}</b>
                                       </label>
                                    </td>
                                     <td>
                                     {this.state.labellist[index].toString() === "First Name"?
                                      <input type="text" disabled={true} autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                     : <input type="text" size="20" autocomplete="off" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>}
                                        
                                         {this.state.labellist[index].toString() === "Last Name" ?
                                      <input type="text" disabled={true} autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                     :<div style={{display:"hidden"}}></div>}

                                      {this.state.labellist[index].toString() === "Last working day"?
                                      <input type="text" disabled={true} autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                     :<div style={{display:"hidden"}}></div>}

                                      {this.state.labellist[index].toString() === "Date of joining"?
                                      <input type="text" disabled={true} autocomplete="off" size="20" style={{border:"2px solid darkgrey" ,height:"30px",borderRadius:"2px" }} id={id} required value={emp[id]} onChange={(e)=>this.handleemployee(e,id)}/>
                                     :<div style={{display:"hidden"}}></div>}

                                    </td>
                                 </tr>
                      })}
                    </table>
               
                    }        
                    })} 
                                        <button className="empaddsubmit btn btn-primary" onClick={(e)=>this.updateemployee(e)}  >Update</button>
                                        <button className="empaddsubmit btn btn-danger" onClick={(e)=> { if (window.confirm('Are you sure you wish to delete this Employee?')) this.deleteemployee(e)} }  >Delete</button>
                      </div>}

                      <div id="div" ></div>
                 </div>

   


      
               
    </div>
  )}
}

export default UpdatedeleteEmp;



