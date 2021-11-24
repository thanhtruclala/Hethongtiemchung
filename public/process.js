$(document).ready(function() {
    //Khai bao abi va dia chi Contract
    const abi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "_vaccine",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_sender",
                    "type": "address"
                }
            ],
            "name": "chichvaccines",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "arrTiemchung",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "ID",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "vaccine",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_vaccine",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                }
            ],
            "name": "chichvaccine",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const addressSC = "0x676F7a0718207e8847Bfc6027ae4fB4f811f2CB4";

    const web3 = new Web3(window.ethereum);
    //Tao contract MetaMask
    var contract = new web3.eth.Contract(abi,addressSC);

    //Tao contract Infura
    var provider = new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/9758f2c4b2f941efa9feb257b37003cc");
    const web3_infura = new Web3(provider);
    var contract_infura = web3_infura.eth.Contract(abi,addressSC);
    
    //Pop-up
    var modal = $('.modal');

    contract_infura.events.chichvaccines({filter: {},fromBlock:"latest"},function(error,info){
        if (error){
            console.log(error);
        }
        else {
            console.log(info);
            $.post("/update",{
                Vaccine:info.returnValues[1],
                CCCD:info.returnValues[0],
                User:info.returnValues[2]
            },function(data){
                console.log(data);
                $('#notification').html("<p>Thêm thông tin tiêm chủng <b>thành công</b>!</p></br><p>Họ và tên: "+data.obj.HoTen+"</p></br><p>CCCD: "+data.obj.CCCD+"</p></br><p>Vaccine: "+data.Vaccine.name+"</p>")
            });
        } 
    });

    var account_MM = '';

    $("#connectMM").click(function() {
        connectMM().then((data) => {
            account_MM = data[0];
            $("#statusmetamask").html("<p>Tình trạng MetaMask: Đã kết nối</p></br><p>Address: "+account_MM +"</p>");
        }).catch((err) => {
            console.log(err);
        });
    });

    $("#submit").click(function(){
        $.post("/dangky", {
            HoTen:$("#name").val(),
            NgaySinh:$("#date").val(),
            GioiTinh:$("input[type=radio][name=sex]:checked").val(),
            DiaChi:$("#place").val(),
            SDT:$("#phone").val(),
            CCCD:$("#cccd").val()
        }, function(data){
            console.log(data);
            if (data.status == "success"){
                $('#notification').html("<p>Đăng ký <b>thành công</b> !</p>")
            }
            else if (data.status == "error-insert"){
                $('#notification').html("<p>Đã <b>tồn tại</b> công dân trên Cơ sở dữ liệu!</p>")
            }
            else {
                $('#notification').html("<p>Đăng ký <b>thất bại</b>!</p>")

            }
            modal.show();
        });
    });

    $("#submitadd").click(function(){
        $.post("/tiemvaccine",{
            CCCD:$("#_cccd").val(),
            Vaccine:$("select#selectadd").find(":selected").val()
        }, function(data){
            console.log(data);
            if (account_MM == "") {
                $('#notification').html("<p>Chưa <b>kết nối</b> MetaMask</p>")
            }
            else if (data.status == "success-to-sent"){
                $('#notification').html("<p>Vui lòng <b>xác nhận </b>và <b>chờ </b> SmartContract phản hồi! (Quá trình có thể mất nhiều thời gian hơn do kết nối mạng!)</p>")
                contract.methods.chichvaccine(data.Vaccine,data.obj.CCCD).send({
                    from:account_MM
                });
            }
            else if (!data.obj) {
                $('#notification').html("<p><b>Không</b> tìm thấy thông tin công dân!</p>")
            }
            else {
                $('#notification').html("<p>Thêm thông tin tiêm chủng <b>thất bại</b>!</p>")
            }
            modal.show();
        });
    });
    
    $("#submitsearch").click(function(){
        $.post("/search", {
            CCCD:$("#namesearch").val()
        },async function(data){
            if (!data.obj){
                $("#updatesearch").html('<td colspan="6">Không tìm thấy thông tin công dân</td>');
            }
            else {
                $("#updatesearch").html('<td>'+data.obj.HoTen+'</td><><td>'+data.obj.NgaySinh+'</td><td>'+data.obj.GioiTinh+'</td><td>'+data.obj.DiaChi+'</td><td>'+data.obj.Vaccine1.name+'</td><td>'+data.obj.Vaccine2.name+'</td></>');
                $("#updatesearch1").html('<td colspan="4">Người tiêm: </td><td>'+await(tracuuNV(data.obj.Vaccine1.nguoitiem))+'</td><td>'+await(tracuuNV(data.obj.Vaccine1.nguoitiem))+'</td>')
            }
        });
    });
    
async function tracuuNV(address_nv){
        const result= await $.post('/searchNV', {
                        AddressNV: address_nv})
                    console.log(result)
                    return result;
    }; 
    
    $('.close').click(function () {
        modal.hide();
    });

    $(window).on('click', function (e) {
        if ($(e.target).is('.modal')) {
        modal.hide();
        }
    });
});

async function connectMM(){
    if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts;
        }
}