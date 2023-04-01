const path = require("path");
const fs = require("fs");


function fileDisplay(filePath,files_all){
	//根据文件路径读取文件，返回文件列表
	let files = fs.readdirSync(filePath);
	files.forEach(function(filename){
		//获取当前文件的绝对路径
		var filedir = path.join(filePath,filename);

		//根据文件路径获取文件信息，返回一个fs.Stats对象
		const stats = fs.statSync(filedir)
		var isFile = stats.isFile();//是文件
		var isDir = stats.isDirectory();//是文件夹
		if(isFile){
			let name = path.basename(filedir);
			if(name.startsWith('xb-')||name.startsWith('filter-')){
				files_all.push(filedir);
			}
		}
		if(isDir){
			fileDisplay(filedir,files_all);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
		}
	});

}
function getComponents(name){
	const filePath = path.join(__dirname,'./dist/'+name);
	let files = [];
	fileDisplay(filePath,files);

	return files;
}
module.exports = {
	// set your styleguidist configuration here
	title: 'xb-lib 文档',
	components: 'dist/**/xb-*.vue',
	require: [path.join(__dirname, 'styleguide/global.requires.js')],
	copyCodeButton:true,
	pagePerSection:true,
	styleguideDir:'styleguide/dist',
	styleguidePublicPath:'',
	sections: [

		{
			name: '介绍',
			content: 'styleguide/docs/Documentation.md',
		},
		{
			name: '主页',
			href: '../',
		},
		{
			name:'hooks',
			sections:[
				{
					name:'useAntdTable',
					content: 'styleguide/docs/hooks/useAntdTable.md',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				}
			],

		},

		{
			name:'工具',
			sections:[
				{
					name:'地图',
					content: 'styleguide/docs/utils/tianditu.md',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				},
				{
					name:'工具包',
					content: 'styleguide/docs/utils/tool.md',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				}
			],

		},
		{
			name:'地图管理',
			sections:[
				{
					name:'基础',
					content: 'styleguide/docs/map-manger/init.md',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name:'地图元素',
					content: 'styleguide/docs/map-manger/map_el.md',
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name:'类',
					href:'/pc/docs/map-manger/class-doc/',
				},

			],

		},
		{
			name: '组件',
			sections: [
				{
					name: '弹窗',
					content: 'styleguide/docs/modal.md',
					components: () => getComponents('modal'),
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name: '页面布局',
					content: 'styleguide/docs/page.md',
					components: () => getComponents('page'),
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name: '表单',
					content: 'styleguide/docs/form.md',
					components: () => getComponents('input'),
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name: '搜索',
					content: 'styleguide/docs/filter.md',
					components: () => getComponents('filter'),
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				},
				{
					name: '页面显示',
					content: 'styleguide/docs/page-show.md',
					components: () => getComponents('page-show'),
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
				}
			],
			sectionDepth: 1
		}
	],
	// defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// },

	exampleMode: 'collapse'
}
