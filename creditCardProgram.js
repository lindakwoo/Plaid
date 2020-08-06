//Luhn 10 algorithm check for valid numbers
let checkNumber = (num) => {
    let numArr = num.split("");
    let sum = 0;
    for(let i=numArr.length-1;i>=0;i-=2){
        let number = parseInt(numArr[i])
        sum+=number;
    }
    for(let i=numArr.length-2;i>=0;i-=2){
        let doubled = numArr[i]*2;
        if(doubled>9){
            let str = doubled.toString();
            let digitSum = parseInt(str[0])+parseInt(str[1]);
            sum+=digitSum;
        }else{
            sum+=doubled;
        }
    }
    if(sum%10===0){
        return true;
    }else{
        return false;
    }
}


let creditCardProvider = (operations) => {
    let final =[];
    let accounts = [];
    let currentPerson={};
    for(event of operations){
        //get rid of the $ sign and change to number
        let dollarAmt = event[event.length-1];
        let minus$ = dollarAmt.slice(1);
        event[event.length-1]=parseInt(minus$);
        //add new account
        if(event[0] === "Add"){
                let newAccount = {
                    name:event[1],
                    number:event[2],
                    limit:event[3],
                    balance:0,
                    valid:checkNumber(event[2]) //checks if number is valid, using Luhn 10 algorithm
                }
                accounts.push(newAccount);
        //make charge to existing account    
        }else if(event[0] === "Charge"){
            let charge = event[2];
            for(let i = 0;i<accounts.length;i++){
                if(accounts[i]["name"] === event[1]){
                    currentPerson = accounts[i];
                }
            }
            if(currentPerson["name"] && currentPerson["valid"]){
                if((currentPerson["balance"]+charge) > currentPerson["limit"]){
                    //ignore
                }else{
                    currentPerson["balance"] = currentPerson["balance"]+charge;
                }
            }else{
                //ignore
            }
        //make credit to existing account    
        }else if(event[0] === "Credit"){
            let credit = event[2];
            for(let i = 0;i<accounts.length;i++){
                if(accounts[i]["name"] === event[1]){
                    currentPerson = accounts[i];
                }
            }
            if(currentPerson["name"] && currentPerson["valid"]){
                currentPerson["balance"] = currentPerson["balance"]-credit;
            }
            else{
                //ignore
            }   
        }  
    }   

    //push into final outputs array
    for(account of accounts){
        if(account["valid"]){
            let dollar = "$"+account["balance"];
            final.push([account["name"], dollar]);
        }else{
            final.push([account["name"], "error"]);
        }
    }

    final.sort((a,b)=>{
        return a[0].toLowerCase()>b[0].toLowerCase()?1:-1;
     })

    return final;

}

