## ANACONDA
python官网地址：https://www.python.org/
conda: https://github.com/conda/conda
anaconda: https://www.anaconda.com/
conda、miniconda、anaconda的区别：https://juejin.cn/post/7262280335978987557

```bash
conda env list
conda activate <env_name>
python --version
which python
uv init <project_name>
uv add <package_name>
```

## UV
python包管理工具uv：https://github.com/astral-sh/uv
installation | uv: https://docs.astral.sh/uv/getting-started/installation/

uv配置阿里云源：

再 pyproject.toml 中添加：

```bash
[[tool.uv.index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
default = true
```

或在 uv.toml 中添加：

```bash
[[index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
default = true
```


## 基础教程

python基础教程：https://www.runoob.com/python/python-install.html


## Ollama
https://ollama.com/

```bash
ollama serve
ollama ls # 查看已有的模型
```

## PyCharm
https://www.jetbrains.com/pycharm/download/

## 调用 Ollama 模型

使用 langchain-ollama 调用 Ollama 模型：https://python.langchain.com/docs/integrations/chat/ollama/

```python
from langchain_ollama import ChatOllama


if __name__ == "__main__":
    llm = ChatOllama(model="kimi-k2.5:cloud")
    messages = [
        (
            "system",
            "You are a helpful assistant that translates English to French. Translate the user sentence.",
        ),
        ("human", "I love programming."),
    ]
    resp = llm.invoke("你是谁？")
    print(resp)

```

流式调用：
```python
from langchain_ollama import ChatOllama


if __name__ == "__main__":
    llm = ChatOllama(model="kimi-k2.5:cloud")
    messages = [
        (
            "system",
            "You are a helpful assistant that translates English to French. Translate the user sentence.",
        ),
        ("human", "I love programming."),
    ]
    resp = llm.stream("你是谁？")
    for chunk in resp:
        print(chunk.content, end="", flush=True)
```

## 使用 SecretStr 类型对 api_key 进行加密

安装 pydantic:
```bash
uv add pydantic
```

```python
from pydantic import SecretStr


class Config:
    api_key: SecretStr = SecretStr("your-api-key")
```

## 提示词

### PromptTemplate

```python
from langchain_core.prompts import PromptTemplate

promptTemplate = PromptTemplate.from_template("今天{something}真不错")

prompt = promptTemplate.format(something="天气")
print(prompt)
```

### ChatPromptTemplate

```python
from langchain_core.prompts import ChatPromptTemplate

chat_prompt_template = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的翻译，擅长回答{domain}领域问题"),
    ("human", "{input}"),
])

prompt = chat_prompt_template.format_messages(input="你好", domain="python")
print(prompt)
```
### ChatMessagePromptTemplate

进一步抽象提示词，ChatMessagePromptTemplate 可以结合 ChatPromptTemplate 使用，同时对提示词和消息体进行抽象和复用。

```python
from langchain_core.prompts import ChatPromptTemplate,ChatMessagePromptTemplate


system_message_template = ChatMessagePromptTemplate.from_template(
    template="你是一个专业的翻译，擅长回答{domain}领域问题",
    role="system",
)

human = ChatMessagePromptTemplate.from_template(
    template="{input}",
    role="human",
)

chat_prompt_template = ChatPromptTemplate.from_messages([
    system_message_template,
    human,
])

prompt = chat_prompt_template.format_messages(input="你好", domain="python")
print(prompt)
```

### FewShotPromptTemplate(少样本提示模版)

```python
from langchain_core.prompts import PromptTemplate,FewShotPromptTemplate

example_template = "输入：{input}\n输出：{output}"
examples = [
    {"input": "将'Hello'翻译成中文", "output": "你好"},
    {"input": "将'Month'翻译成中文", "output": "月份"},
]


few_shot_prompt_template = FewShotPromptTemplate(
    examples=examples,
    example_prompt=PromptTemplate.from_template(example_template),
    prefix="请将以下英文翻译成中文：",
    suffix="输入：{text}\n输出：",
    input_variables=["text"]
)


prompt = few_shot_prompt_template.format(text="Thank you")

print(prompt)
```

### 链式调用

```python
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate,FewShotPromptTemplate

llm = ChatOllama(model="kimi-k2.5:cloud")

example_template = "输入：{input}\n输出：{output}"
examples = [
    {"input": "将'Hello'翻译成中文", "output": "你好"},
    {"input": "将'Month'翻译成中文", "output": "月份"},
]


few_shot_prompt_template = FewShotPromptTemplate(
    examples=examples,
    example_prompt=PromptTemplate.from_template(example_template),
    prefix="请将以下英文翻译成中文：",
    suffix="输入：{text}\n输出：",
    input_variables=["text"]
)

chain = few_shot_prompt_template | llm
resp = chain.stream(input={"text": "Thank you!"})

for chunk in resp:
    print(chunk.content, end="")
```

## 工具函数调用

```python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

from app.common import chat_prompt_template, llm

class AddInputArgs(BaseModel):
    a: int = Field(description="first number")
    b: int = Field(description="second number")
@tool(
    description= "add two numbers",
    args_schema=AddInputArgs,
)
def add(a,b):
    """add two numbers"""
    return a+b

tools_dict = {
    "add": add
}
#
# add_tools = Tool.from_function(func=add, name="add", description="Add two numbers")

llm_with_tools = llm.bind_tools([add])


chain = chat_prompt_template | llm_with_tools

resp = chain.invoke(input={"domain": "数学计算", "input": "100加100等于多少？"})

for tool_calls in resp.tool_calls:
   func_name = tool_calls["name"]
   func = tools_dict[func_name]
   args = tool_calls["args"]
   print(tool_calls)
   tool_content = func.invoke(args)
   print(tool_content)
```