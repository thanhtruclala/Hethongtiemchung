//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
struct SoVaccine {
        string ID;
        string vaccine;
}        
contract Tiemchung {
    event chichvaccines(string _id,string _vaccine,address _sender);
    SoVaccine[] public arrTiemchung;
    
    function chichvaccine(string memory _vaccine,string memory _id) public {
        SoVaccine memory newvaccine = SoVaccine(_id,_vaccine);
        arrTiemchung.push(newvaccine);
        emit chichvaccines(_id,_vaccine,msg.sender);
    }
}