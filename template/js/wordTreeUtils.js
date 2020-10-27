
/*
*    wordTreeUtils.js
*    Word Tree
*    Customer Effort Exploration
*/

function searchWordReturnSentence (word, sentenceList)
{
  var returningSentences = []
  var i;
  var wordSearchResult = "";
  var wordSearch = new RegExp(word);
  for (i = 0; i < sentenceList.length; i++)
  {
    if (wordSearch.test(sentenceList[i]) == true)
    {
      returningSentences.push(wordSearch.exec(sentenceList[i]));
    }
  }
  return returningSentences;
}


function getCommonWordCombo (word, sentenceList)
{
  var commonWordList = []
  var commonWordListResult = "";
  var wordSearch = new RegExp(word + ' (\\w+).?(\\w+)?.?(.*)?');

  for (i = 0; i < sentenceList.length; i++)
  {
    sentenceList[i]["input"] = sentenceList[i]["input"].replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
    if (wordSearch.test(sentenceList[i]["input"]) == true)
    {
      // let result = wordSearch.exec(sentenceList[i]["input"]);
      // var filtered_result = result.filter(x => x !== undefined);
      // commonWordList.push(filtered_result);
      commonWordList.push(wordSearch.exec(sentenceList[i]["input"]));
    }
  }
  // console.log(commonWordList)
  return commonWordList;
}



function addNewRoot(dictionaryBase,rootWord) {
  dictionaryBase.rootWord = {};
  dictionaryBase.rootWord.word = rootWord;
  dictionaryBase.rootWord.wordCount = 1;
  dictionaryBase.rootWord.parentWord = 'null';
  dictionaryBase.rootWord.children = [];
  return;
}


function addChildren(parentDictList,rootWord,word,childword,finalSentence)
{
  if (parentDictList.rootWord.children == undefined)
  {
    parentDictList.rootWord.children = [];
  }
  var alreadyChild = [];
  for (i = 0; i < parentDictList.rootWord.children.length; i++)
  {
    if (parentDictList.rootWord.children[i] != undefined)
    {
      alreadyChild.push(parentDictList.rootWord.children[i]);
    }
  }
  // console.log("I'm not an only child" +alreadyChild);
  var wordInalreadychildList = false;
  for (var i = 0; i < alreadyChild.length; i++)
  {
    // console.log(word + " " + alreadyChild[i]['word'])
    if (alreadyChild[i]['word'] == word)
    {
      wordInalreadychildList = true;
      break;
    }
  }
  if (wordInalreadychildList == false)
  {
    parentDictList.rootWord.children.push({"word":word,
                                            "wordCount" : 1,
                                             "parentWord":rootWord,
                                             "children": [{"word": childword,
                                                            "wordCount" : 1,
                                                            "parentWord":word,
                                                            "children":[{"word": finalSentence,
                                                                        "wordCount" : 1,
                                                                         "parentWord": childword}]}]})
  }

  if (wordInalreadychildList == true)
  {
    var needCreateNewGrandchild = true;
    for (var i = 0; i < parentDictList.rootWord.children.length; i++)
    {
      // parentDictList.rootWord.children[i]
      if (parentDictList.rootWord.children[i].word == word)
      {
        parentDictList.rootWord.children[i].wordCount += 1;
        if (parentDictList.rootWord.children[i].children == undefined)
        {
          parentDictList.rootWord.children[i].children = [];
        }
        var grandchildList = [];
        for (var iz = 0; iz < parentDictList.rootWord.children[i].children.length; iz++)
        {
          if (parentDictList.rootWord.children[i].children[iz].word == childword)
          {
            parentDictList.rootWord.children[i].children[iz].wordCount += 1;
            needCreateNewGrandchild = false;
            if (parentDictList.rootWord.children[i].children[iz].children == undefined)
            {
              parentDictList.rootWord.children[i].children[iz].children = [];
            }
            parentDictList.rootWord.children[i].children[iz].children.push({"word": finalSentence,
                                                                        "wordCount": 1,
                                                                        "parentWord":childword})
          }
        }
        if (needCreateNewGrandchild == true)
        {
          parentDictList.rootWord.children[i].children.push({"word": childword,
                                                            "wordCount": 1,
                                                            "parentWord":word,
                                                            "children":[{"word": finalSentence,
                                                                          "wordCount": 1,
                                                                          "parentWord": childword}]})
        }
      }
    }
  }
}


function trimBranch(branch) {
  for (var i = 0; i< branch.children.length; i++) {
    if (branch.children[i].name == undefined) {
      branch.children.splice(i,1);
    }
  }
  return branch;
}

function trimTree(tree) {
   for (var i = 0; i< tree.children.length; i++){
     tree.children[i] = trimBranch(tree.children[i]);
     tree = trimTree(tree.children[i]);
   }
   return tree;
}