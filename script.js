const categoriesBtn = document.querySelector('#categories-btn');
const binBtn = document.querySelector('#bin-btn');
const fontBiggerBtn = document.querySelector('#bigger-font-btn');
const fontSmallerBtn = document.querySelector('#smaller-font-btn');
let fontRemInit = 1.2; //same as body css
const saveTaskBtn = document.querySelector('#save-task-btn');
const clearTaskBtn = document.querySelector('#clear-form-btn');
const textInput = document.querySelector('#text-input');
const dateInput = document.querySelector('#date-input');
const timeInput = document.querySelector('#time-input');
const colorInput = document.querySelector('#color-input')
const timeCb = document.querySelector('#time-cb');
const bodyBot = document.querySelector('#body-bot');
const categoriesSelect = document.querySelector('#categories-select');
const addCategoryForm = document.querySelector('#add-category-form');
const categorySettingsMain = document.querySelector('#category-settings-main');
const rowsCont = document.querySelector('#category-row-cont');
const categorySettingsBtn = document.querySelector('#category-settings-btn');
const exitCategoriesMainBtn = document.querySelector('#exit-categories-main-btn');
const exitAddCategoryFormBtn = document.querySelector('#add-category-form-cancel');
const categoryHeaderAddBtn = document.querySelector('#category-header-add-btn');
const addCategoryNameInput = document.querySelector('#add-category-name-input');
const addCategoryColorSelect = document.querySelector('#add-category-color-select');
const addCategorySubmitBtn = document.querySelector('#submit-category-form-btn');
const binBot = document.querySelector('#bin-bot');
const exitBinBtn = document.querySelector('#close-bin-btn');
const clearBinBtn = document.querySelector('#clear-bin-btn');
const binSelect = document.querySelector('#bin-select');
const themesBtn = document.querySelector('#themes-btn');
let bin = [
	// {
	// 	// text: "",
	// 	// date: "",
	// 	// time: "",
	// 	// color: ""
	// }
]
const colorArr = [
	{
		name: 'Royal Red',
		color: '#822B2B'
	},
	{
		name: 'Military Green',
		color: '#282726'
	},
	{
		name: 'Mist',
		color: '#6A8A82'
	},
	{
		name: 'Desert',
		color: '#A37C27'
	},
	{
		name: 'Earth',
		color: '#563838'
	},
	{
		name: 'Galaxy',
		color: '#6465A5'
	},
	// 'blue', 'green', 'yellow', 'lime', 'violet', 'bisque'
];
let divTasksArr = [];
let binTasksArr = [];
let categoryArr = [
	{
		name: 'Main',
		noteColor: '#822B2B',
		tasks: [
			// {
			// 	// text: "",
			// 	// date: "",
			// 	// time: "",
			// 	// color: ""
			// }
		]

	}
];



// let currTasksArr = [];

// categoryArr = JSON.parse(localStorage.categoryArr);
// localStorage.categoryArr = JSON.stringify(categoryArr)
document.body.style.width = window.innerWidth;
if(!localStorage.categoryArr || !localStorage.bin){
	firstTimeLocal();
	firstTimeInputs();
}
categorySelectUpdateOnRefresh();
tasksDisplayOnRefresh();
themeOnRefresh();
colorSelectBuilder(addCategoryColorSelect);
shadowListeners();
categoryRowBuilderOnRefresh();

// timeCb.addEventListener('change', function(){
// 	if(timeCb.checked){
// 		timeInput.disabled = false;
// 		console.log('checked');
// 	}else{
// 		timeInput.disabled = true;
// 		timeInput.value="";
// 		console.log('what');
// 	}
// })
saveTaskBtn.addEventListener('click', addTask);
categorySettingsBtn.addEventListener('click', showCategoriesMain);
exitCategoriesMainBtn.addEventListener('click', function(){
	categorySettingsMain.style.display = "none";
})
exitAddCategoryFormBtn.addEventListener('click', function(){
	addCategoryForm.style.display = "none";
})
categoryHeaderAddBtn.addEventListener('click', openAddCategoryForm);
addCategorySubmitBtn.addEventListener('click', createNewCategory)
categoriesSelect.addEventListener('change', categoryChange);
colorInput.addEventListener('input', function(){
	textInput.style.backgroundColor = colorInput.value;
})
textInput.addEventListener('keydown', function(e){
	if (e.keyCode==13){
		e.preventDefault();
		addTask();
	}
})
fontBiggerBtn.addEventListener('click', function(e){
	if(e.target==fontBiggerBtn){
		if(fontRemInit<5){
			fontRemInit+=.5;
			textInput.style.fontSize = fontRemInit + "rem";
		}
		textInput.focus();
	}
});
fontSmallerBtn.addEventListener('click', function(e){
	if(e.target==fontSmallerBtn){
		if(fontRemInit>1.5){
			fontRemInit-=.5;
			textInput.style.fontSize = fontRemInit + "rem";
		}
		textInput.focus();
	}
});
binBtn.addEventListener('click', function(){
	document.querySelector('#bin').style.display = "flex";
})
exitBinBtn.addEventListener('click', function(){
	document.querySelector('#bin').style.display = "none";
})
clearBinBtn.addEventListener('click', clearBin);
binSelect.addEventListener('change', binCategoryChange);
clearTaskBtn.addEventListener('click', function(){
	textInput.value = "";
	dateInput.value = "";
	timeInput.value = "";
	colorInput.value = categoryArr[categoriesSelect.value].noteColor;
	textInput.style.backgroundColor = colorInput.value;
	console.log('RUNNING');
});
themesBtn.addEventListener('click', themesOpen);


// FUNCTIONS *******************************************************
// FUNCTIONS *******************************************************
// FUNCTIONS *******************************************************
// FUNCTIONS *******************************************************
// FUNCTIONS *******************************************************
function addTask(){
	if(textInput.value==""){
		alertInvalidText();
	} else {
		let taskObj = {
			text: textInput.value,
			date: dateInput.value,
			time: timeInput.value,
			color: colorInput.value,
			fontSize: textInput.style.fontSize
		}
		categoryArr[categoriesSelect.value].tasks.unshift(taskObj);
		clickDisplay();
		loadToLocal();
		listenToTaskDivs();
		resetForm();
	}
}
function clickDisplay(){
	let nextTask = document.createElement('div');
	bodyBot.prepend(nextTask);
	divTasksArr.unshift(nextTask);
	dressUp(nextTask);
}
function dressUp(task){
	task.className = 'task fade-in';
	task.style.backgroundColor = colorInput.value;
	let taskText = document.createElement('div');
	let taskDate = document.createElement('div');
	let taskTime = document.createElement('div');
	let taskTrash = document.createElement('i');
	let taskEdit = document.createElement('i');
	taskText.className="task-text";
	taskDate.className="task-date";
	taskTime.className="task-time";
	taskTrash.boxShadow = 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px';
	taskEdit.className="fas fa-pencil-alt";
	taskEdit.style.display="none";
	taskTrash.className="fas fa-trash";
	taskTrash.style.display = "none";

	taskTrash.addEventListener('click', function(){
		taskTrash.parentNode.style.display = "none";
		const index = divTasksArr.indexOf(taskTrash.parentNode);
		const categoryMemory =categoryArr[categoriesSelect.value].name;
		const textMemory =categoryArr[categoriesSelect.value].tasks[index].text;
		const fontSizeMemory=categoryArr[categoriesSelect.value].tasks[index].fontSize;
		const dateMemory=categoryArr[categoriesSelect.value].tasks[index].date;
		const timeMemory=categoryArr[categoriesSelect.value].tasks[index].time;
		const colorMemory = categoryArr[categoriesSelect.value].tasks[index].color;
		divTasksArr.splice(index, 1);
		categoryArr[categoriesSelect.value].tasks.splice(index, 1);
		saveToBin(textMemory, fontSizeMemory, dateMemory, timeMemory, colorMemory, categoryMemory);
		tempBinClear();
		allBinMassDressUp();
		loadToLocal();
	})

	taskEdit.addEventListener('click', function(e){
		const index = divTasksArr.indexOf(e.target.parentNode);
		const categoryIndex = categoriesSelect.value;
		// change fields to input fields
		divTasksArr[index].querySelector('.task-text').style.display = "none";
		let taskTextInput = document.createElement('textarea');
		taskTextInput.className="task-text";
		taskTextInput.textContent=categoryArr[categoriesSelect.value].tasks[index].text;
		taskTextInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		taskTextInput.style.fontSize = divTasksArr[index].children[0].style.fontSize;
		e.target.parentNode.append(taskTextInput);

		divTasksArr[index].querySelector('.task-date').style.display = "none";
		let taskDateInput = document.createElement('input');
		taskDateInput.type = "date";
		taskDateInput.value = categoryArr[categoryIndex].tasks[index].date;
		taskDateInput.className="task-date";
		taskDateInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		e.target.parentNode.append(taskDateInput);

		divTasksArr[index].querySelector('.task-time').style.display = "none";
		let taskTimeInput = document.createElement('input');
		taskTimeInput.type = "time";
		taskTimeInput.value = categoryArr[categoryIndex].tasks[index].time;
		taskTimeInput.className="task-time";
		taskTimeInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		e.target.parentNode.append(taskTimeInput);

		let taskEditSelectColor = document.createElement('select');
		taskEditSelectColor.className="task-edit-select-color";
		// taskEditSelectColor.value = categoryArr[categoryIndex].tasks[index].color;
		taskEditSelectColor.textContent="C";
		colorSelectBuilder(taskEditSelectColor);
		// e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;
		taskEditSelectColor.addEventListener('change', function(){
			e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;
		})
		e.target.parentNode.appendChild(taskEditSelectColor);

		let taskEditFontPlus = document.createElement('div');
		taskEditFontPlus.className="task-edit-font-plus";
		taskEditFontPlus.textContent="A+";
		taskEditFontPlus.addEventListener('click', function(){
			let fontSizeNum = parseFloat(categoryArr[categoryIndex].tasks[index].fontSize);
			if(fontSizeNum<6){
				fontSizeNum+=.5;
				categoryArr[categoryIndex].tasks[index].fontSize = fontSizeNum+'rem';
				taskTextInput.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
				taskText.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
			} else if (!fontSizeNum){
				categoryArr[categoryIndex].tasks[index].fontSize = "1.5rem";
			}
		})
		e.target.parentNode.appendChild(taskEditFontPlus);

		let taskEditFontMinus = document.createElement('div');
		taskEditFontMinus.className="task-edit-font-minus";
		taskEditFontMinus.textContent="A-";
		taskEditFontMinus.addEventListener('click', function(){
			let fontSizeNum = parseFloat(categoryArr[categoryIndex].tasks[index].fontSize);
			if(fontSizeNum>.5){
				fontSizeNum-=.5;
				categoryArr[categoryIndex].tasks[index].fontSize = fontSizeNum+'rem';
				taskTextInput.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
				taskText.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
			}
		})
		e.target.parentNode.appendChild(taskEditFontMinus);

		//change edit btn to save btn
		e.target.style.display = "none";
		let editSaveTaskBtn = document.createElement('btn');
		editSaveTaskBtn.className="task-edit";
		editSaveTaskBtn.innerHTML='<i class="fas fa-save"></i>';
		editSaveTaskBtn.style.backgroundColor="red";
		editSaveTaskBtn.style.display="flex";
		e.target.parentNode.appendChild(editSaveTaskBtn);

		//elistner to save btn
		editSaveTaskBtn.addEventListener('click', function(){
			// none the inputs, update the originals, flex the originals
			taskTextInput.style.display = "none";
			taskDateInput.style.display = "none";
			taskTimeInput.style.display = "none";
			taskEditSelectColor.style.display = "none";
			editSaveTaskBtn.style.display = "none";
			taskEditFontPlus.style.display = "none";
			taskEditFontMinus.style.display = "none";

			divTasksArr[index].querySelector('.task-text:not(textarea)').textContent = taskTextInput.value;
			divTasksArr[index].querySelector('.task-date:not(input)').textContent = taskDateInput.value;
			divTasksArr[index].querySelector('.task-time:not(input)').textContent = taskTimeInput.value;
			e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;

			divTasksArr[index].querySelector('.task-text:not(textarea)').style.display = "flex";
			divTasksArr[index].querySelector('.task-date:not(input)').style.display = "flex";
			divTasksArr[index].querySelector('.task-time:not(input)').style.display = "flex";
			e.target.display = "none";

			// update object and datebase
			categoryArr[categoryIndex].tasks[index].text = taskTextInput.value;
			categoryArr[categoryIndex].tasks[index].date = taskDateInput.value;
			categoryArr[categoryIndex].tasks[index].time = taskTimeInput.value;
			categoryArr[categoryIndex].tasks[index].color = taskEditSelectColor.value;

			console.log('categoryArr[categoryIndex].tasks[index]:',categoryArr[categoryIndex].tasks[index]);
			console.log('categoryArr[categoryIndex].tasks:',categoryArr[categoryIndex].tasks[index]);

			loadToLocal();

		})
	})

	taskText.textContent=categoryArr[categoriesSelect.value].tasks[0].text;
	taskText.style.fontSize=categoryArr[categoriesSelect.value].tasks[0].fontSize;
	taskDate.textContent=categoryArr[categoriesSelect.value].tasks[0].date;
	taskTime.textContent=categoryArr[categoriesSelect.value].tasks[0].time;
	task.appendChild(taskText);
	task.appendChild(taskDate);
	task.appendChild(taskTime);
	task.appendChild(taskTrash);
	task.appendChild(taskEdit);
	// listenToTaskDivs();
}
function massDressUp(categoryIndex){ //dresses up all tasks inside certain category by category index
	for (let i = 0; i < categoryArr[categoryIndex].tasks.length; i++) {
	divTasksArr[i] = document.createElement('div');
	divTasksArr[i].className='task';
	divTasksArr[i].style.backgroundColor=categoryArr[categoryIndex].tasks[i].color;
	let taskText = document.createElement('div');
	let taskDate = document.createElement('div');
	let taskTime = document.createElement('div');
	let taskTrash = document.createElement('i');
	let taskEdit = document.createElement('i');
	taskText.className="task-text";
	taskDate.className="task-date";
	taskTime.className="task-time";
	taskEdit.className="fas fa-pencil-alt";
	taskEdit.style.display="none";
	taskTrash.className="fas fa-trash";
	taskTrash.style.display = "none";


	taskTrash.addEventListener('click', function(){
		taskTrash.parentNode.style.display = "none";
		const index = divTasksArr.indexOf(taskTrash.parentNode);
		const categoryMemory =categoryArr[categoriesSelect.value].name;
		const textMemory =categoryArr[categoriesSelect.value].tasks[index].text;
		const fontSizeMemory=categoryArr[categoriesSelect.value].tasks[index].fontSize;
		const dateMemory=categoryArr[categoriesSelect.value].tasks[index].date;
		const timeMemory=categoryArr[categoriesSelect.value].tasks[index].time;
		const colorMemory = categoryArr[categoryIndex].tasks[index].color;
		divTasksArr.splice(index, 1);
		categoryArr[categoryIndex].tasks.splice(index, 1);
		saveToBin(textMemory, fontSizeMemory, dateMemory, timeMemory, colorMemory, categoryMemory);
		tempBinClear();
		allBinMassDressUp();
		loadToLocal();
	})

	taskEdit.addEventListener('click', function(e){
		const index = divTasksArr.indexOf(e.target.parentNode);
		// change fields to input fields
		divTasksArr[index].querySelector('.task-text').style.display = "none";
		let taskTextInput = document.createElement('textarea');
		taskTextInput.className="task-text";
		taskTextInput.textContent=categoryArr[categoriesSelect.value].tasks[i].text;
		taskTextInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		taskTextInput.style.fontSize = divTasksArr[index].children[0].style.fontSize;
		e.target.parentNode.append(taskTextInput);

		divTasksArr[index].querySelector('.task-date').style.display = "none";
		let taskDateInput = document.createElement('input');
		taskDateInput.type = "date";
		taskDateInput.value = categoryArr[categoryIndex].tasks[index].date;
		taskDateInput.className="task-date";
		taskDateInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		e.target.parentNode.append(taskDateInput);

		divTasksArr[index].querySelector('.task-time').style.display = "none";
		let taskTimeInput = document.createElement('input');
		taskTimeInput.type = "time";
		taskTimeInput.value = categoryArr[categoryIndex].tasks[index].time;
		taskTimeInput.className="task-time";
		taskTimeInput.style.backgroundColor = "rgba(219, 219, 219, .4)";
		e.target.parentNode.append(taskTimeInput);

		let taskEditSelectColor = document.createElement('select');
		taskEditSelectColor.className="task-edit-select-color";
		// taskEditSelectColor.value = categoryArr[categoryIndex].tasks[index].color;
		taskEditSelectColor.textContent="C";
		colorSelectBuilder(taskEditSelectColor);
		// e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;
		taskEditSelectColor.addEventListener('change', function(){
			e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;
		})
		e.target.parentNode.appendChild(taskEditSelectColor);

		let taskEditFontPlus = document.createElement('div');
		taskEditFontPlus.className="task-edit-font-plus";
		taskEditFontPlus.textContent="A+";
		taskEditFontPlus.addEventListener('click', function(){
			let fontSizeNum = parseFloat(categoryArr[categoryIndex].tasks[index].fontSize);
			if(fontSizeNum<6){
				fontSizeNum+=.5;
				categoryArr[categoryIndex].tasks[index].fontSize = fontSizeNum+'rem';
				taskTextInput.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
				taskText.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
			} else if (!fontSizeNum){
				categoryArr[categoryIndex].tasks[index].fontSize = "1.5rem";
			}
		})
		e.target.parentNode.appendChild(taskEditFontPlus);

		let taskEditFontMinus = document.createElement('div');
		taskEditFontMinus.className="task-edit-font-minus";
		taskEditFontMinus.textContent="A-";
		taskEditFontMinus.addEventListener('click', function(){
			let fontSizeNum = parseFloat(categoryArr[categoryIndex].tasks[index].fontSize);
			if(fontSizeNum>.5){
				fontSizeNum-=.5;
				categoryArr[categoryIndex].tasks[index].fontSize = fontSizeNum+'rem';
				taskTextInput.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
				taskText.style.fontSize = categoryArr[categoryIndex].tasks[index].fontSize;
			}
		})
		e.target.parentNode.appendChild(taskEditFontMinus);

		//change edit btn to save btn
		e.target.style.display = "none";
		let editSaveTaskBtn = document.createElement('btn');
		editSaveTaskBtn.className="task-edit";
		editSaveTaskBtn.innerHTML='<i class="fas fa-save"></i>';
		editSaveTaskBtn.style.backgroundColor="red";
		editSaveTaskBtn.style.display="flex";
		e.target.parentNode.appendChild(editSaveTaskBtn);

		//elistner to save btn
		editSaveTaskBtn.addEventListener('click', function(){
			// none the inputs, update the originals, flex the originals
			taskTextInput.style.display = "none";
			taskDateInput.style.display = "none";
			taskTimeInput.style.display = "none";
			taskEditSelectColor.style.display = "none";
			editSaveTaskBtn.style.display = "none";
			taskEditFontPlus.style.display = "none";
			taskEditFontMinus.style.display = "none";

			divTasksArr[index].querySelector('.task-text:not(textarea)').textContent = taskTextInput.value;
			divTasksArr[index].querySelector('.task-date:not(input)').textContent = taskDateInput.value;
			divTasksArr[index].querySelector('.task-time:not(input)').textContent = taskTimeInput.value;
			e.target.parentNode.style.backgroundColor = taskEditSelectColor.value;

			divTasksArr[index].querySelector('.task-text:not(textarea)').style.display = "flex";
			divTasksArr[index].querySelector('.task-date:not(input)').style.display = "flex";
			divTasksArr[index].querySelector('.task-time:not(input)').style.display = "flex";
			e.target.display = "none";

			// update object and datebase
			categoryArr[categoryIndex].tasks[index].text = taskTextInput.value;
			categoryArr[categoryIndex].tasks[index].date = taskDateInput.value;
			categoryArr[categoryIndex].tasks[index].time = taskTimeInput.value;
			categoryArr[categoryIndex].tasks[index].color = taskEditSelectColor.value;

			console.log('categoryArr[categoryIndex].tasks[index]:',categoryArr[categoryIndex].tasks[index]);
			console.log('categoryArr[categoryIndex].tasks:',categoryArr[categoryIndex].tasks[index]);

			loadToLocal();

		})
	})

	taskText.textContent=categoryArr[categoriesSelect.value].tasks[i].text;
	taskText.style.fontSize=categoryArr[categoriesSelect.value].tasks[i].fontSize;
	taskDate.textContent=categoryArr[categoriesSelect.value].tasks[i].date;
	taskTime.textContent=categoryArr[categoriesSelect.value].tasks[i].time;
	divTasksArr[i].appendChild(taskText);
	divTasksArr[i].appendChild(taskDate);
	divTasksArr[i].appendChild(taskTime);
	divTasksArr[i].appendChild(taskTrash);
	divTasksArr[i].appendChild(taskEdit);
	bodyBot.append(divTasksArr[i]);
	listenToTaskDivs();
	}
}
function listenToTaskDivs(){
	for (let i = 0; i < divTasksArr.length; i++) {
		divTasksArr[i].addEventListener('mouseenter', function(e){
			let myTrash = e.target.querySelector('.fa-trash');
			let myEdit = e.target.querySelector('.fa-pencil-alt');
			myTrash.style.display = "flex";
			myEdit.style.display = "flex";
			e.target.style.boxShadow = "rgba(46, 202, 244, 0.35) 0px 5px 15px"
		})
	}
	for (let i = 0; i < divTasksArr.length; i++) {
		divTasksArr[i].addEventListener('mouseleave', function(e){
			let myTrash = e.target.querySelector('.fa-trash');
			let myEdit = e.target.querySelector('.fa-pencil-alt');
			myTrash.style.display = "none";
			myEdit.style.display = "none";
			e.target.style.boxShadow = "none";
		})
	}
	//also listen to binned-tasks divs
	for (let i = 0; i < binTasksArr.length; i++) {
		binTasksArr[i].addEventListener('mouseenter', function(e){
			let myTrash = e.target.querySelector('.fa-skull-crossbones');
			let myRessurect = e.target.querySelector('.task-ressurect');
			myTrash.style.display = "flex";
			myRessurect.style.display = "flex";
			e.target.style.boxShadow = "rgba(46, 202, 244, 0.35) 0px 5px 15px"
		})
	}
	for (let i = 0; i < binTasksArr.length; i++) {
		binTasksArr[i].addEventListener('mouseleave', function(e){
			let myTrash = e.target.querySelector('.fa-skull-crossbones');
			let myRessurect = e.target.querySelector('.task-ressurect');
			myTrash.style.display = "none";
			myRessurect.style.display = "none";
			e.target.style.boxShadow = "none";
		})
	}
}
// function listenToBinDivs(){
// 	for (let i = 0; i < binTasksArr.length; i++) {
// 		binTasksArr[i].addEventListener('mouseenter', function(e){
// 			let myTrash = e.target.querySelector('.task-trash');
// 			myTrash.style.display = "flex";
// 			e.target.style.boxShadow = "rgba(46, 202, 244, 0.35) 0px 5px 15px"
// 		})
// 	}
// 	for (let i = 0; i < binTasksArr.length; i++) {
// 		binTasksArr[i].addEventListener('mouseleave', function(e){
// 			let myTrash = e.target.querySelector('.task-trash');
// 			myTrash.style.display = "none";
// 			e.target.style.boxShadow = "none";
// 		})
// 	}
// }
function resetForm(){
	textInput.placeholder = "";
	textInput.value = "";
	dateInput.value = "";
	timeInput.value = "";
}
function alertInvalidText(){
	textInput.placeholder = "You need to type something.";
	console.log('WORKING');
}
function firstTimeLocal(){
	localStorage.categoryArr = JSON.stringify(categoryArr);
	localStorage.bin = JSON.stringify(bin);
	localStorage.theme = JSON.stringify(themes[0]);
}
function updateFromLocal(){
	// localStorage.currTasksArr = JSON.stringify(currTasksArr);
	categoryArr = JSON.parse(localStorage.categoryArr);
	bin = JSON.parse(localStorage.bin);
}
function loadToLocal(){
	// localStorage.currTasksArr = JSON.stringify(currTasksArr);
	localStorage.categoryArr = JSON.stringify(categoryArr);
	localStorage.bin = JSON.stringify(bin);
}
function loadThemeSettingsToLocal(themeObj){
	localStorage.theme = themeObj;
}
function tasksDisplayOnRefresh(){
	// const currCategory = localStorage.currCategory; //when the user returs to the same category he left at
	updateFromLocal;
	const currCategoryIndex = categoriesSelect.value;
	textInput.style.backgroundColor = categoryArr[currCategoryIndex].noteColor;

	massDressUp(currCategoryIndex);
	allBinMassDressUp();
}
function shadowListeners(){
	let btns = document.querySelectorAll('button');
	let inputField = document.querySelector('#form-l')
	for (let i = 0; i < btns.length; i++) {
		btns[i].addEventListener('mouseenter', function(){
		btns[i].style.boxShadow = "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
		})
		btns[i].addEventListener('mouseleave', function(){
		btns[i].style.boxShadow = "rgba(7, 27, 12, 0.24) 0px 3px 8px";
		})		
	}
	inputField.addEventListener('mouseenter', function(){
		inputField.style.boxShadow = "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
		})
		inputField.addEventListener('mouseleave', function(){
		inputField.style.boxShadow = "rgba(7, 27, 12, 0.24) 0px 3px 8px";
	})		
}
function showCategoriesMain(){
	categorySettingsMain.style.display = "flex";
}
function openAddCategoryForm(){
	categorySettingsMain.style.display = "none";
	addCategoryForm.style.display = "flex";
}
function createNewCategory(){
	let categoryObj = {
		name: addCategoryNameInput.value,
		noteColor: addCategoryColorSelect.value,
		tasks: []
	}
	categoryArr.push(categoryObj);
	//add a row
	categoryRowBuilderLive(categoryObj);
	//add an option with value of index in arr
	//add an option in bin select
	// const option = document.createElement("option");
	// option.text = categoryObj.name;	
	let option = document.createElement('option');
	option.value = categoryArr.length-1;
	option.text = categoryObj.name;
	categoriesSelect.add(option);
	categoriesSelect.options[option.value].selected = true;
	categoryChange();
	let option2 = document.createElement('option'); // because the first option bugs when applied to both selects
	option2.text = categoryObj.name;
	binSelect.add(option2);
	addCategoryForm.style.display = "none";
	loadToLocal();
}
function categoryRowBuilderOnRefresh(){
	for (let i = 0; i < categoryArr.length; i++) {
		let row = document.createElement('div');
		row.className="category-row"
		let rowName = document.createElement('div');
		rowName.className="category-row-name";
		rowName.textContent=categoryArr[i].name;
		let rowNoteColor = document.createElement('div');
		rowNoteColor.className="category-row-note-color";
		rowNoteColor.textContent=categoryArr[i].noteColor;
		rowNoteColor.style.color=rowNoteColor.textContent;
		let rowLeftCont = document.createElement('div');
		rowLeftCont.className="category-row-namecolor-cont";
		let rowRightCont = document.createElement('div');
		rowRightCont.className="category-row-btn-cont";
		let rowEditBtn = document.createElement('button');
		rowEditBtn.className="category-row-edit-btn";
		rowEditBtn.innerHTML = '<i class="fas fa-pen"></i>';
		let rowTrashBtn = document.createElement('button');
		rowTrashBtn.className="category-row-delete-btn";
		rowTrashBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

		rowTrashBtn.addEventListener('click', function(){
			//find curr index and kill the cat
			let catName = rowName.textContent;
			let index = categoryArr.findIndex(x => x.name === catName);
			//deletes a category
			row.style.display = "none";
			categoriesSelect.remove(index);
			binSelect.remove(index+1);
			console.log('removed');
			console.log(binSelect[index+1]);
			categoryArr.splice(index, 1);
			categoryChange();
			loadToLocal();
		})

		rowEditBtn.addEventListener('click', function(){
			//change name to input
			rowName.style.display = "none";
			let rowInput = document.createElement('input');
			rowInput.className="category-row-name";
			// rowInput.style.width = "50%";
			rowLeftCont.style.backgroundColor  = "gray";
			rowInput.value=rowName.textContent;
			rowLeftCont.prepend(rowInput);
	
			//change color to select
			rowNoteColor.style.display = "none";
			let rowNoteColorSelect = document.createElement('select');
			rowNoteColorSelect.className="category-row-note-color";
			rowNoteColorSelect.style.fontSize=".95rem";
			// rowNoteColor.textContent=categoryObj.noteColor;
			// rowNoteColor.style.color=rowNoteColor.textContent;
			colorSelectBuilder(rowNoteColorSelect);
			rowLeftCont.append(rowNoteColorSelect);
	
			//change btn
			rowEditBtn.style.display="none";
			let saveEditBtn = document.createElement('button');
			saveEditBtn.className="category-row-edit-btn";
			saveEditBtn.style.backgroundColor="darkgreen";
			saveEditBtn.style.fontSize="1.05rem";
			saveEditBtn.innerHTML = '<i class="fas fa-save"></i>';
			rowRightCont.prepend(saveEditBtn);
	
			// eventlisten to new btn - saving values from inputs
			saveEditBtn.addEventListener('click', function(){
				console.log('WORKING');
				let nameValue = rowInput.value;
				let colorValue = rowNoteColorSelect.value;
				rowName.style.display = "flex";
				rowNoteColor.style.display = "flex";
				rowInput.style.display = "none";
				rowNoteColorSelect.style.display = "none";
				rowLeftCont.style.backgroundColor  = "inherit";
				rowName.textContent = nameValue;
				rowNoteColor.textContent = colorValue;
				saveEditBtn.style.display = "none";
				rowEditBtn.style.display = "flex";
				//moreover, save new name and color to obj
				categoryArr[i].name = nameValue;
				categoryArr[i].noteColor = colorValue;
				console.log('categoryArr');
				console.log(categoryArr);
				//changes the correspoding select option
				categoriesSelect.options[categoryArr.indexOf(categoryArr[i])].textContent=nameValue;
				// corresponding binned slecet
				binSelect.options[categoryArr.indexOf(categoryArr[i])+1].textContent=nameValue;
				loadToLocal();
				categoryChange();
			})
		})
		rowLeftCont.appendChild(rowName);
		rowLeftCont.appendChild(rowNoteColor);
		rowRightCont.appendChild(rowEditBtn);
		if(i!=0){
			rowRightCont.appendChild(rowTrashBtn);
		}
		row.appendChild(rowLeftCont);
		row.appendChild(rowRightCont);
		// categorySettingsMain.appendChild(row);
		rowsCont.appendChild(row);

	}
}
function categoryRowBuilderLive(categoryObj){
	let row = document.createElement('div');
	row.className="category-row"
	let rowName = document.createElement('div');
	rowName.className="category-row-name";
	rowName.textContent=categoryObj.name;
	console.log('categoryObj.name: ' + categoryObj.name);
	let rowNoteColor = document.createElement('div');
	rowNoteColor.className="category-row-note-color";
	rowNoteColor.textContent=categoryObj.noteColor;
	rowNoteColor.style.color=rowNoteColor.textContent;
	let rowLeftCont = document.createElement('div');
	rowLeftCont.className="category-row-namecolor-cont";
	let rowRightCont = document.createElement('div');
	rowRightCont.className="category-row-btn-cont";
	let rowEditBtn = document.createElement('button');
	rowEditBtn.className="category-row-edit-btn";
	rowEditBtn.innerHTML = '<i class="fas fa-pen"></i>';
	let rowTrashBtn = document.createElement('button');
	rowTrashBtn.className="category-row-delete-btn";
	rowTrashBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	rowTrashBtn.addEventListener('click', function(){
		//deletes a category
		row.style.display = "none";
		categoriesSelect.remove(categoryArr.indexOf(categoryObj))
		console.log('categoryArr.indexOf(categoryObj)');
		console.log(categoryArr.indexOf(categoryObj));
		console.log('removed');
		console.log(binSelect[categoryArr.indexOf(categoryObj)+1]);
		binSelect.remove(categoryArr.indexOf(categoryObj)+1);
		categoryArr.splice(categoryArr.indexOf(categoryObj), 1);
		categoryChange();
		loadToLocal();
	})
	
	rowEditBtn.addEventListener('click', function(){
		//change name to input
		rowName.style.display = "none";
		let rowInput = document.createElement('input');
		rowInput.className="category-row-name";
		// rowInput.style.width = "50%";
		rowLeftCont.style.backgroundColor  = "gray";
		rowInput.value=rowName.textContent;
		rowLeftCont.prepend(rowInput);

		//change color to select
		rowNoteColor.style.display = "none";
		let rowNoteColorSelect = document.createElement('select');
		rowNoteColorSelect.className="category-row-note-color";
		rowNoteColorSelect.style.fontSize=".95rem";
		// rowNoteColor.textContent=categoryObj.noteColor;
		// rowNoteColor.style.color=rowNoteColor.textContent;
		colorSelectBuilder(rowNoteColorSelect);
		rowLeftCont.append(rowNoteColorSelect);

		//change btn
		rowEditBtn.style.display="none";
		let saveEditBtn = document.createElement('button');
		saveEditBtn.className="category-row-edit-btn";
		saveEditBtn.style.backgroundColor="darkgreen";
		saveEditBtn.style.fontSize="1.05rem";
		saveEditBtn.innerHTML = '<i class="fas fa-save"></i>';
		rowRightCont.prepend(saveEditBtn);

		// eventlisten to new btn - saving values from inputs
		saveEditBtn.addEventListener('click', function(){
			console.log('WORKING');
			let nameValue = rowInput.value;
			let colorValue = rowNoteColorSelect.value;
			rowName.style.display = "flex";
			rowNoteColor.style.display = "flex";
			rowInput.style.display = "none";
			rowNoteColorSelect.style.display = "none";
			rowLeftCont.style.backgroundColor  = "inherit";
			rowName.textContent = nameValue;
			rowNoteColor.textContent = colorValue;
			saveEditBtn.style.display = "none";
			rowEditBtn.style.display = "flex";
			//moreover, save new name and color to obj
			categoryObj.name = nameValue;
			categoryObj.noteColor = colorValue;
			console.log('categoryArr');
			console.log(categoryArr);
			//changes the correspoding select option
			categoriesSelect.options[categoryArr.indexOf(categoryObj)].textContent=nameValue;
			//corresponding binned select
			binSelect.options[categoryArr.indexOf(categoryObj)+1].textContent=nameValue;
			loadToLocal();
			categoryChange();
		})
	})
	rowLeftCont.appendChild(rowName);
	rowLeftCont.appendChild(rowNoteColor);
	rowRightCont.appendChild(rowEditBtn);
	rowRightCont.appendChild(rowTrashBtn);
	row.appendChild(rowLeftCont);
	row.appendChild(rowRightCont);
	rowsCont.appendChild(row);
}
function categorySelectUpdateOnRefresh(){
	updateFromLocal();
	for (let i = 0; i < categoryArr.length; i++) {
		let option = document.createElement('option');
		option.value = i;
		option.textContent = categoryArr[i].name;
		categoriesSelect.appendChild(option);
	}

	// add select for bin
	for (let i = 0; i < categoryArr.length; i++) {
		let option = document.createElement('option');
		option.value = i;
		option.textContent = categoryArr[i].name;
		binSelect.appendChild(option);
	}

	//ALSO adding up color display
	colorInput.value = categoryArr[categoriesSelect.value].noteColor;
}
// function categorySelectUpdateLive(categoryObj){
// 	let option = document.createElement('option');
// 	option.value = categoryArr.length;
// 	option.text = categoryObj.name;
// 	// categoriesSelect.add(option);
// 	// categoriesSelect.add(option);
// 	binSelect.add(option);
// 	console.log('LIVE');
// }
function colorSelectBuilder(select){
	for (let i = 0; i < colorArr.length; i++) {
		let option = document.createElement('option');
		option.textContent = colorArr[i].name;
		option.value = colorArr[i].color;
		option.style.color = option.value;
		select.append(option);
	}
}
function categoryChange(){ //shows only current category tasks
	// 1. clean
	let currentTaskDisplay = document.querySelectorAll('.task');
	for (let i = 0; i < currentTaskDisplay.length; i++) {
		bodyBot.removeChild(currentTaskDisplay[i]);
	}
	//dress by val
	massDressUp(categoriesSelect.value)
	colorInput.value=categoryArr[categoriesSelect.value].noteColor;
	textInput.style.backgroundColor = colorInput.value;
	// find option of color select by value (if it's equal to cat color)
	// and select it
	for (let i = 0; i < colorInput.options.length; i++) {
		if (colorInput.options[i].value==categoryArr[categoriesSelect.value].noteColor){
			colorInput.options[i].selected = true;
		}
	}
}
function saveToBin(text, fontSize, date, time, color, category){
	// saveToBin(textMemory, fontSizeMemory, dateMemory, timeMemory);
	let binTaskObj = {
		category: category,
		text: text,
		fontSize: fontSize,
		date: date,
		time: time,
		color: color
	}
	bin.unshift(binTaskObj);
	console.log('bin:');
	console.log(bin);
}
function tempBinClear(){
	let currentBinnedTaskDisplay = document.querySelectorAll('.binned-task');
	for (let i = 0; i < currentBinnedTaskDisplay.length; i++) {
		binBot.removeChild(currentBinnedTaskDisplay[i]);
	}
	// binTasksArr = [];
}
function clearBin(){
	tempBinClear();
	bin = [];
	loadToLocal();
	console.log('bin is now:');
	console.log(bin);
}
function binCategoryChange(){ //shows only current category tasks
	// 1. clean
	tempBinClear();
	binMassDressUp(binSelect.options[binSelect.selectedIndex].text) //gets selected option name
	console.log('CATEGORY NAME is:');
	console.log(binSelect.options[binSelect.selectedIndex].text);
	// function categoryChange(){ //shows only current category tasks
	// 	//dress by val
	// 	massDressUp(categoriesSelect.value)
	// 	colorInput.value=categoryArr[categoriesSelect.value].noteColor;
	// 	textInput.style.backgroundColor = colorInput.value;
	// }

}
function binMassDressUp(categoryName){ //dresses up all tasks inside certain category by category index
	//build the current category binned array
	let currBinnedCatArr = [];
	for (let i = 0; i < bin.length; i++) {
		if(categoryName=='All'){
			currBinnedCatArr = bin;
		} else if(bin[i].category==categoryName){
			currBinnedCatArr.push(bin[i]);
		}
	}
	console.log('bin is: ');
	console.log(bin);
	console.log('currBinnedCatArr is of cat ' + categoryName + ' and is:');
	console.log(currBinnedCatArr);

	for (let i = 0; i < currBinnedCatArr.length; i++) {
		binTasksArr[i] = document.createElement('div');
		binTasksArr[i].className='binned-task';
		binTasksArr[i].style.backgroundColor=currBinnedCatArr[i].color;
		let taskText = document.createElement('div');
		let taskDate = document.createElement('div');
		let taskTime = document.createElement('div');
		let taskTrash = document.createElement('div');
		let taskResurrect = document.createElement('div');
		taskText.className="task-text";
		taskDate.className="task-date";
		taskTime.className="task-time";
		taskResurrect.className="task-ressurect";
		taskResurrect.textContent="Ressurect";
		taskTrash.textContent="X";
		taskTrash.className="task-trash";
		taskTrash.addEventListener('click', function(e){
			e.target.parentNode.style.display = "none";
			currBinnedCatArr.splice(currBinnedCatArr.indexOf(e.target.parentNode), 1);
			bin.splice(bin.indexOf(e.target.parentNode), 1);

			console.log('bin is: ');
			console.log(bin);
			console.log('currBinnedCatArr is of cat ' + categoryName + ' and is:');
			console.log(currBinnedCatArr);

			loadToLocal();
		})
		taskResurrect.addEventListener('click', function(e){
			//unshift to the binnedtask from which 
			// we deleted the task
			let index = binTasksArr.indexOf(e.target.parentNode);
			let category = bin[index].category;
			console.log('category' ,category);
			for (let i = 0; i < categoryArr.length; i++) {
				if(category==categoryArr[i].name){
					console.log(categoryArr[i]);
					categoryArr[i].tasks.unshift(bin[index]);
					console.log('categoryArr[i].tasks',categoryArr[i].tasks);
					let nextTask = document.createElement('div');
					dressUp(nextTask);
					//dressUp gives the task the category default notecolor. I'll change this now
					nextTask.style.backgroundColor = currBinnedCatArr[i].color;
					console.log('nextTask',nextTask);
					//add to body bot only if current select matches the cat
					if(categoriesSelect.options[categoriesSelect.selectedIndex].textContent==category){
						bodyBot.prepend(nextTask);
					}
					divTasksArr.unshift(nextTask);
					binTasksArr.splice(index, 1)
					bin.splice(index, 1)
					console.log('bin',bin);
					console.log('bninTasksArr',binTasksArr);
					// binBot.removeChild(e.target.parentNode);
					e.target.parentNode.style.display = "none";
					listenToTaskDivs();
					loadToLocal();
				}
			}
		})
		taskText.textContent=currBinnedCatArr[i].text;
		taskText.style.fontSize=currBinnedCatArr[i].fontSize;
		taskDate.textContent=currBinnedCatArr[i].date;
		taskTime.textContent=currBinnedCatArr[i].time;
		binTasksArr[i].appendChild(taskText);
		binTasksArr[i].appendChild(taskDate);
		binTasksArr[i].appendChild(taskTime);
		binTasksArr[i].appendChild(taskTrash);
		binTasksArr[i].appendChild(taskResurrect);
		// console.log('taskRessurect');
		// console.log(taskRessurect);
		binBot.append(binTasksArr[i]);
		listenToTaskDivs();
	}
}
function allBinMassDressUp(){ //dresses up all tasks inside certain category by category index
	for (let i = 0; i < bin.length; i++) {
		binTasksArr[i] = document.createElement('div');
		binTasksArr[i].className='binned-task';
		binTasksArr[i].style.backgroundColor=bin[i].color;
		let taskText = document.createElement('div');
		let taskDate = document.createElement('div');
		let taskTime = document.createElement('div');
		let taskTrash = document.createElement('i');
		let taskResurrect = document.createElement('div');
		taskText.className="task-text";
		taskDate.className="task-date";
		taskTime.className="task-time";
		taskResurrect.className="task-ressurect";
		taskResurrect.textContent="Ressurect";
		// taskTrash.textContent="X";
		taskTrash.className="fas fa-skull-crossbones";
		taskTrash.style.display = "none";
		taskTrash.addEventListener('click', function(e){
			e.target.parentNode.style.display = "none";

			// let index = bin.findIndex(x => x.name === catName);
			let index = binTasksArr.indexOf(e.target.parentNode);
			console.log('index is:' + index);
			binTasksArr.splice(index, 1);
			bin.splice(index, 1);
			
			loadToLocal();
			// console.log('e.target.parentNode:');
			// console.log(e.target.parentNode);
			console.log('bin is: ');
			console.log(bin);
		})
		taskResurrect.addEventListener('click', function(e){
			//unshift to the binnedtask from which 
			// we deleted the task
			let index = binTasksArr.indexOf(e.target.parentNode);
			let category = bin[index].category;
			console.log('category' ,category);
			for (let i = 0; i < categoryArr.length; i++) {
				if(category==categoryArr[i].name){
					console.log(categoryArr[i]);
					categoryArr[i].tasks.unshift(bin[index]);
					console.log('categoryArr[i].tasks',categoryArr[i].tasks);
					let nextTask = document.createElement('div');
					dressUp(nextTask);
					//dressUp gives the task the category default notecolor. I'll change this now
					nextTask.style.backgroundColor = bin[index].color;
					console.log('nextTask',nextTask);
					//add to body bot only if current select matches the cat
					if(categoriesSelect.options[categoriesSelect.selectedIndex].textContent==category){
						bodyBot.prepend(nextTask);
					}
					divTasksArr.unshift(nextTask);
					binTasksArr.splice(index, 1)
					bin.splice(index, 1)
					console.log('bin',bin);
					console.log('bninTasksArr',binTasksArr);
					// binBot.removeChild(e.target.parentNode);
					e.target.parentNode.style.display = "none";
					listenToTaskDivs();
					loadToLocal();
				}
			}
		})
		taskText.textContent=bin[i].text;
		taskText.style.fontSize=bin[i].fontSize;
		taskDate.textContent=bin[i].date;
		taskTime.textContent=bin[i].time;
		binTasksArr[i].appendChild(taskText);
		binTasksArr[i].appendChild(taskDate);
		binTasksArr[i].appendChild(taskTime);
		binTasksArr[i].appendChild(taskTrash);
		binTasksArr[i].appendChild(taskResurrect);
		binBot.append(binTasksArr[i]);
		listenToTaskDivs();
	}
}
function firstTimeInputs(){
	const color = categoryArr[0].noteColor;
	console.log('color: ' + color);
	colorInput.options[3].selected = true;
	console.log('colorInput.options[3].selected : ' + colorInput.options[3].selected);
	textInput.style.backgroundColor = color; 
	console.log('FIRSTTIMEINPUT');
}
function colorHexToNameTranslator(hex){
	// a stupid function - BEWARE CHANGING COLORARR AND NOT CHANGING THIS
	let name;
	if(hex=="#822B2B"){
		name = "Royal Red";
	} else if (hex=="#282726"){

	}
}
function themesOpen(){
	const themesCont = document.querySelector('#themes-cont');

	//position of themescont shall be fixed because it doesnt work on phone
	themesCont.style.zIndex = 100;


	//change btn
	let themesCloseBtn = document.querySelector('#themes-close');
	themesCloseBtn.style.display = "flex";
	themesBtn.style.display = "none";

	


	//change dimensions
	let themesTop = themesCont.querySelector('#themes-top')
	let themesTopTitle = document.createElement('div');
	themesTopTitle.textContent = "Themes";
	themesTop.appendChild(themesTopTitle);
	
	let themesBot = themesCont.querySelector('#themes-bot')

	themesCont.style.width = "200px";
	themesCont.style.height = "200px";
	themesCont.style.borderRadius = "15px";

	themesTop.style.height = "10%";
	themesTop.style.width = "95%";
	
	themesBot.style.height = "150px";
	themesBot.style.width = "95%";
	themesBot.style.gap = "7px";
	themesBot.style.marginTop = "8px";
	
	//'themes' to the right of i,
	//grid to the bot

	// themes obj arr
	let themes = [
		{
			name: "Underwater",
			myColorArr: [
				"#c7F6EC",
				"#012172",
				"#9199BE",
				"#107050",
				"#1F1641",
				"#16235A"
			],
			mainTextColor: "#c7F6EC",
			headerAndTableColor: "#012172",
			formColor: "#9199BE",
			btnColor: "#107050",
			bodyBgc: "#1F1641",
			beneathNoteColor: "#16235A"
		},
		{
			name: "Blood Mountain",
			myColorArr: [
				"#FFC300",
				"#212027",
				"#F22F08",
				"#8D2F23",
				"#561E18",
				"#8C7462"
			],
			mainTextColor: "#FFC300",
			headerAndTableColor: "#212027",
			formColor: "#F22F08",
			btnColor: "#8D2F23",
			bodyBgc: "#561E18",
			beneathNoteColor: "#8C7462"
		},
		{
			name: "Candy",
			myColorArr: [
				"#AFBADC",
				"#777CA8",
				"#EE6C81",
				"#BB1924",
				"#F092A5",
				"#16235A"
			],
			mainTextColor: "#AFBADC",
			headerAndTableColor: "#777CA8",
			formColor: "#EE6C81",
			btnColor: "#BB1924",
			bodyBgc: "#F092A5",
			beneathNoteColor: "#16235A"
		},
		{
			name: "Nespresso",
			myColorArr: [
				"#F2EBE9",
				"#3F2A1D",
				"#8E6248",
				"#8C7462",
				"#24150E",
				"#16235A"
			],
			mainTextColor: "#F2EBE9",
			headerAndTableColor: "#3F2A1D",
			formColor: "#8E6248",
			btnColor: "#8C7462",
			bodyBgc: "#24150E",
			beneathNoteColor: "#16235A"
		}
	]

	//append themes divs to grid
	// a theme div have theme class, have 6 divs inside which get the bgc from
	// the obj
	let theme1Div = document.createElement('div');
	let theme2Div = document.createElement('div');
	let theme3Div = document.createElement('div');
	let theme4Div = document.createElement('div');
	let themeDivArr = [theme1Div, theme2Div, theme3Div, theme4Div];
	for (let i = 0; i < themeDivArr.length; i++) {
		themeDivArr[i].className="theme";
		for (let j = 0; j < 6; j++) {
			let colorDiv = document.createElement('div');
			colorDiv.style.backgroundColor = themes[i].myColorArr[j];
			themeDivArr[i].appendChild((colorDiv));
		}
		//create a span for title
		let spanTitle = document.createElement('span');
		spanTitle.className = "span-of-theme";
		spanTitle.textContent = themes[i].name;
		spanTitle.style.fontSize = ".9rem";
		spanTitle.style.color = "white";
		themeDivArr[i].style.position = "relative";
		themeDivArr[i].appendChild(spanTitle);

		themesBot.appendChild(themeDivArr[i]);
		
	}

	//event listener to close
	themesCloseBtn.addEventListener('click', function(){
		themesCont.style.width = "5vh";
		themesCont.style.height = "5vh";

		// themesCont.style.borderRadius = "";

		themesCloseBtn.style.display = "none";
		themesBtn.style.display = "flex";

		themesBot.style.height = "0";
		themesBot.style.width = "0";
		themesBot.style.marginTop = "0";
		themesTop.style.height = "";
		themesTop.style.width = "";



		themesBtn.style.bottom = "0%";
		themesBtn.style.left = "0%";
		// themesBtn.style.position = "initial";
		themesTop.removeChild(themesTopTitle);

		for (let i = 0; i < themeDivArr.length; i++) {
			themesBot.removeChild(themeDivArr[i]);
		}
		themeDivArr=[];
	})

	//eventlistener to each theme.
	// shadow hover
	// on click, change colors of related things.
	// opt: also on hover.
	// save settings to local after.
	for (let i = 0; i < themeDivArr.length; i++) {
		themeDivArr[i].addEventListener('click',function(){
			// set colors to shit
			document.body.style.color = themes[i].mainTextColor; //text color
			document.querySelector('#title').style.backgroundColor = themes[i].headerAndTableColor;
			document.querySelector('#table').style.backgroundColor = themes[i].headerAndTableColor;
			document.querySelector('#form').style.backgroundColor = themes[i].formColor;
			let themeBtnArr = document.body.querySelectorAll('.theme-btn');
			for (let j = 0; j < themeBtnArr.length; j++) {
				themeBtnArr[j].style.backgroundColor = themes[i].btnColor;
			}
			// document.querySelectorAll('.theme-btn').style.backgroundColor = themes[i].btnColor;
			document.body.style.backgroundColor = themes[i].bodyBgc;
			loadThemeSettingsToLocal(JSON.stringify(themes[i]));
		})
	}
}
function themeOnRefresh(){ //get info from theme obj in localStorage
	let obj = JSON.parse(localStorage.theme);
	document.body.style.color = obj.mainTextColor; //text color
	document.querySelector('#title').style.backgroundColor = obj.headerAndTableColor;
	document.querySelector('#table').style.backgroundColor = obj.headerAndTableColor;
	document.querySelector('#form').style.backgroundColor = obj.formColor;
	let themeBtnArr = document.body.querySelectorAll('.theme-btn');
	for (let j = 0; j < themeBtnArr.length; j++) {
		themeBtnArr[j].style.backgroundColor = obj.btnColor;
	}
	// document.querySelectorAll('.theme-btn').style.backgroundColor = obj.btnColor;
	document.body.style.backgroundColor = obj.bodyBgc;
}