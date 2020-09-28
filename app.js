var budgetController = (function(){

    //budget section
    var Expense = function(id , des , val){
        this.id = id ; 
        this.des = des ;
        this.val = val ;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
           
            this.percentage = Math.round((this.val / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id , des , val){
        this.id = id ; 
        this.des = des ;
        this .val = val ;
    }

    var data = {
        allItems :{
            exp : [],
            inc : []
        }, 
        total : {
            inc : 0,
            exp : 0
        },
        budget : 0 ,
        percentage : -1
    }

    function calculateTotal(type){
        var sum = 0;
        data.allItems[type].forEach(item =>{
            sum+= item.val
        });
        data.total[type] = sum;
    }

    



    return{
        //publically accessabel
        newItem : function(type , des , val)   {

            var newItem ,ID;
            //data.allItems[type] , takes out the array needed
            //[data.allItems[type].length - 1] , finds the last element 
            //.id  , fetches id of last element 
            // + 1 ,adds one to last id to make a new one 
             if (data.allItems[type].length > 0) {
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            if(type === 'exp'){
                newItem = new Expense( ID , des , val);
            }else if(type === 'inc'){
                newItem = new Income( ID , des , val);
            }

            data.allItems[type].push(newItem);

            return newItem;

        },

        deleteItm : function(type , id){
            var ids , index;
            
            ids = data.allItems[type].map(function(item){
                return item.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index , 1);
            }

        },

        calculateBudget:function(){
            //calculate total
            calculateTotal('inc');
            calculateTotal('exp');   
            //calculate budget  
            data.budget = data.total.inc - data.total.exp;
            //calculate percentage
            if(data.total.inc > 0 ){
                data.percentage = Math.round((data.total.exp / data.total.inc)*100);
            }else{
                data.percentage = -1;
            }
            
            
        },

        calculatePercentages: function() {
            
            
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.total.inc);
            });
        },
        

        getPercentages:function(){
            var allperc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            
            return allperc;
        },

        getBudget : function(){
            return{
                budget:data.budget,
                expenseTotal:data.total.exp,
                incomeTotal:data.total.inc,
                percentage:data.percentage
            }
        },

    


       

        testing: function(){
            console.log(data);
        }

    }

})();




var UIController = (function(){

    //UI section
    DomElements = {
        type : '.add__type',
        desc : '.add__description',
        val : '.add__value',
        addBtn : '.add__btn',
        expenseList : '.expenses__list',
        incomeList : '.income__list',
        budget: '.budget__value',
        income: '.budget__income--value',
        expense: '.budget__expenses--value',
        percentage :'.budget__expenses--percentage',
        container : '.container',
        expPercentage : '.item__percentage',
        dateTag: '.budget__title--month'
    }

    var formatNumber = function(num , type){
        
        var numSplit;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if(int.length>3){
            int = int.substr(0,int.length-3) +','+ int.substr(int.length-3 , 3);
        }


        return (type === 'exp' ? '-' : '+') +' '+int +'.'+dec;

    }

    var nodeListForEach = function(list , callback){

        for(var i = 0 ; i< list.length ; i++){
            callback(list[i] , i)
        }

    }

    



    return{
            //publically accessabel
            //dom elements
            DOM : function(){
                return DomElements;
            },
            
            //inputs from user
            getInput : function(){
                return {
                    type : document.querySelector(DomElements.type).value,
                     description :document.querySelector(DomElements.desc).value,
                     value : parseFloat(document.querySelector(DomElements.val).value)
                };               
            },

            addNewItem : function(obj , type){
            
                //html element to be added 
                var html , element ;
                // var newHtml;

                if(type === 'exp'){
                    element = DomElements.expenseList;
                    html = '<div class="item clearfix" id="exp-'+obj.id+' "><div class="item__description"> '+obj.des+' </div><div class="right clearfix"><div class="item__value">'+formatNumber(obj.val,type) +' </div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
                    
                }
                else if(type==='inc'){
                    element = DomElements.incomeList;
                    html = '<div class="item clearfix" id="inc-'+obj.id+'"><div class="item__description">'+obj.des+'</div><div class="right clearfix"><div class="item__value">'+formatNumber(obj.val,type)+'</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                // console.log(obj);
                //update element with obj texts
                //  newHtml = html.replace('%id%', obj.id);
                // newHtml = newHtml.replace('%description%', obj.des);
                // newHtml = newHtml.replace('%value%', obj.val);
    
                //update in dom ,, add using dom.insertAdjacentHTML('beforeend' , html)
                document.querySelector(element).insertAdjacentHTML('beforeend' , html);
                
            }, 

            deleteOne:function(itemID){
                
                var deleteItem = document.getElementById(itemID)

                deleteItem.parentNode.removeChild(deleteItem);
            },

            updateUI:function(obj){     
                var type
                obj.budget>=0 ? type = 'inc' : type = 'exp'

                document.querySelector(DomElements.budget).textContent = formatNumber(obj.budget,type) ;
                document.querySelector(DomElements.income).textContent = formatNumber(obj.incomeTotal,'inc') ;
                document.querySelector(DomElements.expense).textContent = formatNumber(obj.expenseTotal,'exp') ;
                if(obj.percentage>0){   
                document.querySelector(DomElements.percentage).textContent = obj.percentage+'%';
                }else{
                    document.querySelector(DomElements.percentage).textContent = '---';
                }
            },

            displayPercentages : function(percentages){

                var field = document.querySelectorAll(DomElements.expPercentage);

              

                nodeListForEach(field , function(cur  ,index){
                    if(percentages[index] > 0 ){
                        cur.textContent = percentages[index] + '%';
                    }else{
                        cur.textContent = '---';
                    }
                })

            },
            
            clearFields: function(){
                var field , fieldArr;
                field = document.querySelectorAll(DomElements.desc + ', ' + DomElements.val);
                // console.log(field);
                fieldArr = Array.prototype.slice.call(field);
            
                fieldArr.forEach(function(item ) {
                    
                    item.value = ""; //selects and clears value from both .add_description and .add_value

                });
                field[0].focus(); //to set focus to .add_description field
            },

            displayMonth : function(){

                var now , year ,currentMonth , yearMonth; 

                now  = new Date();
                year = now.getFullYear();

                mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Dec']

                currentMonth = mon[now.getMonth()];

                yearMonth =  currentMonth +','+year;

                document.querySelector(DomElements.dateTag).textContent = yearMonth;

            },
            changeType:function(){
                var fields = document.querySelectorAll(
                    DomElements.type +','+
                    DomElements.desc +','+
                    DomElements.val 

                )

                nodeListForEach(fields , function(cur){
                    cur.classList.toggle('red-focus');
                })

                document.querySelector(DomElements.addBtn).classList.toggle('red')
            }

       
    }

})();

var controller = (function(budgetCtrl , UICtrl){

    //budget section
  

    var eventListeners = function(){

    var DOM = UICtrl.DOM(); //dom ui elements
    //clicked the checked icon
    document.querySelector(DOM.addBtn).addEventListener('click', clickOrEnter);
    //enter pressed
    document.addEventListener('keypress' , function(e){
        if(e.keyCode === 13 || e.which === 13){
            clickOrEnter();
        }
    });

    document.querySelector(DOM.container).addEventListener('click' , deletefxn);
    document.querySelector(DomElements.type).addEventListener('change' , UICtrl.changeType)

    }
    
    function calculateAndUpdateBudget(){
        // total exp and inc (BudgetController)
        budgetCtrl.calculateBudget();
        // set it to a variable
        var budget = budgetController.getBudget();
       
        //update UI(UIcontroler)
       UICtrl.updateUI(budget);

    }

   
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UIController.displayPercentages(percentages);


    };
    

    function deletefxn(event){
       
        var itemID , splitID;
         itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //splits id part in two sections ['type','id']
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete from data Structure
            budgetCtrl.deleteItm(type , ID);

            //update ui
            UICtrl.deleteOne(itemID);
            //calculate and update budget 
            calculateAndUpdateBudget();
            //calculate and update percentage
            updatePercentages();

        }
    }

    function clickOrEnter(){
        
        var inputs , newItem;

       inputs = UICtrl.getInput();  //input from UI
       if(inputs.description !== '' && !isNaN(inputs.value) && inputs.value > 0){
        // adding new item to income or expense array
       newItem = budgetCtrl.newItem(inputs.type , inputs.description , inputs.value);
       // add the element to UI
       UICtrl.addNewItem(newItem , inputs.type);
       //clear the fields and set focus back to description field
       UICtrl.clearFields();    
        //budget calculate and update
        calculateAndUpdateBudget();
        //calculate and update percentage
        updatePercentages();
       }

    }


    return{
        init : function(){
            UICtrl.updateUI({
                budget:0,
                expenseTotal:0,
                incomeTotal:0,
                percentage:0
            });
            eventListeners();
            UICtrl.displayMonth();
        }
    }
   

})(budgetController , UIController);

controller.init();