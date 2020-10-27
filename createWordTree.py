# Example usage
# python "../repository/cloned/location/createWordTree.py" --templateFolder="../repository/cloned/location/template/" --data="../location/of/data.xlsx or csv" --column="Data Column Of Interest" --filters="Comma,Seperated,List,Of,Column,Filters" --saveDirectory="../folder/you/want/created"

import os 
import sys 
import argparse
from sklearn.feature_extraction.text import CountVectorizer
from nltk.corpus import stopwords
import nltk
# nltk.download('stopwords')
import shutil
custom_stop_words = ['http','https']
import pandas as pd
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--templateFolder', type=str, help='Location with template')
parser.add_argument('--data', type=str, help='CSV or Xlsx file location.')
parser.add_argument('--column', type=str, help='Text column you want to analyze.')
parser.add_argument('--filters', type=str, help='Column(s) to include as filters. Enter as --filters= xxx,xxx,xxx ')
parser.add_argument('--saveDirectory', type=str, help='Save directory location.')
args = parser.parse_args()

templatedir = os.path.abspath(args.templateFolder)
txtCol = args.column
dataFile = os.path.abspath(args.data)
saveDir = os.path.abspath(args.saveDirectory)
filters = args.filters

if filters:
    filters = filters.split(',')
    print(filters)
else:
    filters = []

if os.path.isdir(saveDir):
    shutil.rmtree(saveDir)

shutil.copytree(templatedir,saveDir)

def openPandasCsvExcelFileGiven(fname):
    if '.csv' in fname.lower():
        df = pd.read_csv(fname)
        return df
    elif '.xlsx' in fname.lower():
        df = pd.read_excel(fname)
        return df
    else:
        print("Make sure it is a .csv or .xlsx file")
        raise ValueError

def topNGrams(data_series,ngram_range_values,custom_stop_words):
    stops =  set(stopwords.words('english')+custom_stop_words)
    stops.remove('not')
    co = CountVectorizer(ngram_range=ngram_range_values,stop_words=stops)
    counts = co.fit_transform(data_series)
    return pd.DataFrame(counts.sum(axis=0),columns=co.get_feature_names()).T.sort_values(0,ascending=False)

df = openPandasCsvExcelFileGiven(dataFile)
df = df[df[txtCol].notnull()]

trigrams = topNGrams(df[txtCol],(3,3),custom_stop_words)

f = open(os.path.join(saveDir,'js/topNGrams.js'),'w',encoding='utf-8')
f.write("var topNGrams = " + trigrams.reset_index().head(30).to_json(orient='values'))
f.close()

treeData = []
listWithin = []

listWithin.append(txtCol)
df[txtCol] = df[txtCol].str.lower()
for col in filters:
    df[col].fillna("Unknown",inplace=True)
    listWithin.append(col)

treeData.append(listWithin)

count = 0
for indx, row in df.iterrows():
    listWithin = []
    listWithin.append(row[txtCol])
    for col in filters:
        listWithin.append(row[col])
    #
    treeData.append(listWithin)


f = open(os.path.join(saveDir,'js/wordTreeData.js'),'w',encoding='utf-8')
f.write("var treeData = " + str(treeData))
f.close()

templateOpenMe = os.path.join(saveDir,"open_me.html")

f = open(templateOpenMe,'r',encoding='UTF-8')
ftxt = f.read()
f.close()

ftxt = ftxt.replace('__title__',txtCol)
f = open(templateOpenMe,'w',encoding='UTF-8')
f.write(ftxt)
f.close()