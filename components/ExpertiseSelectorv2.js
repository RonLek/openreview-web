import { TabList, Tabs, Tab, TabPanels, TabPanel } from './Tabs'
import { useState, useEffect, useCallback, useRef } from 'react'
import Chip from './Chip'
import Accordionv2 from './Accordionv2'
import Collapse from './Collapse'
import CollapseStyles from '../styles/components/Collapse.module.scss'

export default function ExpertiseSelectorv2({
  invitation,
  venueId,
  apiVersion,
  shouldReload,
}) {
  var [keyphrases, setKeyphrases] = useState([
    'conversational systems',
    'document retrieval',
    'information retrieval models',
    'ranked retrieval',
    'retrieval tasks',
    'word retrieval',
  ])
  var [includedKeyphrases, setIncludedKeyphrases] = useState([
    'conversational systems',
    'document retrieval',
    'information retrieval models',
    'ranked retrieval',
    'retrieval tasks',
    'word retrieval',
  ])

  function chipClicked(text) {
    if (includedKeyphrases.includes(text)) {
      console.log(
        includedKeyphrases.filter((keyphrase) => {
          return keyphrase !== text
        })
      )
      setIncludedKeyphrases(
        includedKeyphrases.filter((keyphrase) => {
          return keyphrase !== text
        })
      )
    } else {
      setIncludedKeyphrases([...includedKeyphrases, text])
    }

    console.log(includedKeyphrases)
  }

  function commonElementsExist(keyphrases) {
    console.log('Included keyphrases', includedKeyphrases)
    return keyphrases.some((item) => includedKeyphrases.includes(item))
  }

  var sectionsData = [
    {
      heading:
        'NPRF: A Neural Pseudo Relevance Feedback Framework for Ad-hoc Information Retrieval',
      body: '<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> Pseudo-relevance feedback (PRF) is commonly used to boost the performance of traditional information retrieval (IR) models by using top-ranked documents to identify and weight new query terms, thereby reducing the effect of query-document vocabulary mismatches. While neural retrieval models have recently demonstrated strong results for ad-hoc retrieval, combining them with PRF is not straightforward due to incompatibilities between existing PRF approaches and neural architectures. To bridge this gap, we propose an end-to-end neural PRF framework that can be used with existing neural IR models by embedding different neural models as building blocks. Extensive experiments on two standard test collections confirm the effectiveness of the proposed NPRF framework in improving the performance of two state-of-the-art neural IR models.',
      keyphrases: ['conversational systems', 'document retrieval'],
    },
    {
      heading:
        'Incorporating Relevance Feedback for Information-Seeking Retrieval using Few-Shot Document Re-Ranking',
      body: '<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> Pairing a lexical retriever with a neural re-ranking model has set state-of-the-art performance on large-scale information retrieval datasets. This pipeline covers scenarios like question answering or navigational queries, however, for information-seeking scenarios, users often provide information on whether a document is relevant to their query in form of clicks or explicit feedback. Therefore, in this work, we explore how relevance feedback can be directly integrated into neural re-ranking models by adopting few-shot and parameter-efficient learning techniques. Specifically, we introduce a kNN approach that re-ranks documents based on their similarity with the query and the documents the user considers relevant. Further, we explore Cross-Encoder models that we pre-train using meta-learning and subsequently fine-tune for each query, training only on the feedback documents. To evaluate our different integration strategies, we transform four existing information retrieval datasets into the relevance feedback scenario. Extensive experiments demonstrate that integrating relevance feedback directly in neural re-ranking models improves their performance, and fusing lexical ranking with our best performing neural re-ranker outperforms all other methods by 5.2{%} nDCG@20.',
      keyphrases: [
        'conversational systems',
        'document retrieval',
        'information retrieval models',
      ],
    },
    {
      heading:
        'Expand, Rerank, and Retrieve: Query Reranking for Open-Domain Question Answering',
      body: '<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> We propose EAR, a query Expansion And Reranking approach for improving passage retrieval, with the application to open-domain question answering. EAR first applies a query expansion model to generate a diverse set of queries, and then uses a query reranker to select the ones that could lead to better retrieval results. Motivated by the observation that the best query expansion often is not picked by greedy decoding, EAR trains its reranker to predict the rank orders of the gold passages when issuing the expanded queries to a given retriever. By connecting better the query expansion model and retriever, EAR significantly enhances a traditional sparse retrieval method, BM25. Empirically, EAR improves top-5/20 accuracy by 3-8 and 5-10 points in in-domain and out-of-domain settings, respectively, when compared to a vanilla query expansion model, GAR, and a dense retrieval model, DPR.',
      keyphrases: ['document retrieval', 'ranked retrieval'],
    },
    {
      heading: 'Deep Relevance Ranking Using Enhanced Document-Query Interactions',
      body: "<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> We explore several new models for document relevance ranking, building upon the Deep Relevance Matching Model (DRMM) of Guo et al. (2016). Unlike DRMM, which uses context-insensitive encodings of terms and query-document term interactions, we inject rich context-sensitive encodings throughout our models, inspired by PACRR{'}s (Hui et al., 2017) convolutional n-gram matching features, but extended in several ways including multiple views of query and document inputs. We test our models on datasets from the BIOASQ question answering challenge (Tsatsaronis et al., 2015) and TREC ROBUST 2004 (Voorhees, 2005), showing they outperform BM25-based baselines, DRMM, and PACRR.Pseudo-relevance feedback (PRF) is commonly used to boost the performance of traditional information retrieval (IR) models by using top-ranked documents to identify and weight new query terms, thereby reducing the effect of query-document vocabulary mismatches. While neural retrieval models have recently demonstrated strong results for ad-hoc retrieval, combining them with PRF is not straightforward due to incompatibilities between existing PRF approaches and neural architectures. To bridge this gap, we propose an end-to-end neural PRF framework that can be used with existing neural IR models by embedding different neural models as building blocks. Extensive experiments on two standard test collections confirm the effectiveness of the proposed NPRF framework in improving the performance of two state-of-the-art neural IR models.",
      keyphrases: ['retrieval tasks', 'document retrieval'],
    },
    {
      heading: 'Evaluating Embedding APIs for Information Retrieval',
      body: '<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> The ever-increasing size of language models curtails their widespread access to the community, thereby galvanizing many companies and startups into offering access to large language models through APIs. One particular API, suitable for dense retrieval, is the semantic embedding API that builds vector representations of a given text. With a growing number of APIs at our disposal, in this paper, our goal is to analyze semantic embedding APIs in realistic retrieval scenarios in order to assist practitioners and researchers in finding suitable services according to their needs. Specifically, we wish to investigate the capabilities of existing APIs on domain generalization and multilingual retrieval. For this purpose, we evaluate the embedding APIs on two standard benchmarks, BEIR, and MIRACL. We find that re-ranking BM25 results using the APIs is a budget-friendly approach and is most effective on English, in contrast to the standard practice, i.e., employing them as first-stage retrievers. For non-English retrieval, re-ranking still improves the results, but a hybrid model with BM25 works best albeit at a higher cost. We hope our work lays the groundwork for thoroughly evaluating APIs that are critical in search and more broadly, in information retrieval.',
      keyphrases: ['word retrieval', 'information retrieval models'],
    },
    {
      heading: 'Hurdles to Progress in Long-form Question Answering',
      body: "<div><strong>Canjia Li, Yingfei Sun, Ben He, Le Wang, Kai Hui, Andrew Yates, Le Sun, Jungang Xu</strong></div> The task of long-form question answering (LFQA) involves retrieving documents relevant to a given question and using them to generate a paragraph-length answer. While many models have recently been proposed for LFQA, we show in this paper that the task formulation raises fundamental challenges regarding evaluation and dataset creation that currently preclude meaningful modeling progress. To demonstrate these challenges, we first design a new system that relies on sparse attention and contrastive retriever learning to achieve state-of-the-art performance on the ELI5 LFQA dataset. While our system tops the public leaderboard, a detailed analysis reveals several troubling trends: (1) our system{'}s generated answers are not actually grounded in the documents that it retrieves; (2) ELI5 contains significant train / validation overlap, as at least 81{%} of ELI5 validation questions occur in paraphrased form in the training set; (3) ROUGE-L is not an informative metric of generated answer quality and can be easily gamed; and (4) human evaluations used for other text generation tasks are unreliable for LFQA. We offer suggestions to mitigate each of these issues, which we hope will lead to more rigorous LFQA research and meaningful progress in the future.",
      keyphrases: ['conversational systems', 'document retrieval'],
    },
  ]

  var recommendedPapers = [
    {
      heading: 'Noisy Networks For Exploration',
      body: "<div><strong>Meire Fortunato, Mohammad Gheshlaghi Azar, Bilal Piot, Jacob Menick, Ian Osband, Alex Graves, Vlad Mnih, Remi Munos, Demis Hassabis, Olivier Pietquin, Charles Blundell, Shane Legg</strong></div> We introduce NoisyNet, a deep reinforcement learning agent with parametric noise added to its weights, and show that the induced stochasticity of the agent's policy can be used to aid efficient exploration. The parameters of the noise are learned with gradient descent along with the remaining network weights. NoisyNet is straightforward to implement and adds little computational overhead. We find that replacing the conventional exploration heuristics for A3C, DQN and dueling agents (entropy reward and ϵ-greedy respectively) with NoisyNet yields substantially higher scores for a wide range of Atari games, in some cases advancing the agent from sub to super-human performance.",
      keyphrases: ['ICLR 2018'],
    },
    {
      heading: 'Neural-Guided Deductive Search for Real-Time Program Synthesis from Examples',
      body: '<div><strong>Ashwin Kalyan, Abhishek Mohta, Oleksandr Polozov, Dhruv Batra, Prateek Jain, Sumit Gulwani</strong></div> Synthesizing user-intended programs from a small number of input-output examples is a challenging problem with several important applications like spreadsheet manipulation, data wrangling and code refactoring. Existing synthesis systems either completely rely on deductive logic techniques that are extensively hand-engineered or on purely statistical models that need massive amounts of data, and in general fail to provide real-time synthesis on challenging benchmarks. In this work, we propose Neural Guided Deductive Search (NGDS), a hybrid synthesis technique that combines the best of both symbolic logic techniques and statistical models. Thus, it produces programs that satisfy the provided specifications by construction and generalize well on unseen examples, similar to data-driven systems. Our technique effectively utilizes the deductive search framework to reduce the learning problem of the neural component to a simple supervised learning setup. Further, this allows us to both train on sparingly available real-world data and still leverage powerful recurrent neural network encoders. We demonstrate the effectiveness of our method by evaluating on real-world customer scenarios by synthesizing accurate programs with up to 12x speed-up compared to state-of-the-art systems.',
      keyphrases: ['ICLR 2018'],
    },
    {
      heading:
        'Beyond Good Intentions: Reporting the Research Landscape of {NLP} for Social Good',
      body: "<div><strong>Fernando Gonzalez, Zhijing Jin, Bernhard Schölkopf, Tom Hope, Mrinmaya Sachan, Rada Mihalcea</strong></div> With the recent advances in natural language processing (NLP), a vast number of applications have emerged across various use cases. Among the plethora of NLP applications, many academic researchers are motivated to do work that has a positive social impact, in line with the recent initiatives of NLP for Social Good (NLP4SG). However, it is not always obvious to researchers how their research efforts are tackling today's big social problems. Thus, in this paper, we introduce NLP4SG Papers, a scientific dataset with three associated tasks that can help identify NLP4SG papers and characterize the NLP4SG landscape by: (1) identifying the papers that address a social problem, (2) mapping them to the corresponding UN Sustainable Development Goals (SDGs), and (3) identifying the task they are solving and the methods they are using. Using state-of-the-art NLP models, we address each of these tasks and use them on the entire ACL Anthology, resulting in a visualization workspace that gives researchers a comprehensive overview of the field of NLP4SG. Our website is available at https://nlp4sg.vercel.app. We released our data at https://huggingface.co/datasets/feradauto/NLP4SGPapers and code at https://github.com/feradauto/nlp4sg",
      keyphrases: ['EMNLP 2023'],
    },
    {
      heading: '{SPDF}: Sparse Pre-training and Dense Fine-tuning for Large Language Models',
      body: '<div><strong>Vithursan Thangarasa, Abhay Gupta, William Marshall, Tianda Li, Kevin Leong, Dennis DeCoste, Sean Lie, Shreyas Saxena</strong></div> The pre-training and fine-tuning paradigm has contributed to a number of breakthroughs in Natural Language Processing (NLP). Instead of directly training on a downstream task, language models are first pre-trained on large datasets with cross-domain knowledge (e.g., Pile, MassiveText, etc.) and then fine-tuned on task-specific data (e.g., natural language generation, text summarization, etc.). Scaling the model and dataset size has helped improve the performance of LLMs, but unfortunately, this also lead to highly prohibitive computational costs. Pre-training LLMs often require orders of magnitude more FLOPs than fine-tuning and the model capacity often remains the same between the two phases. To achieve training efficiency w.r.t training FLOPs, we propose to decouple the model capacity between the two phases and introduce Sparse Pre-training and Dense Fine-tuning (SPDF). In this work, we show the benefits of using unstructured weight sparsity to train only a subset of weights during pre-training (Sparse Pre-training) and then recover the representational capacity by allowing the zeroed weights to learn (Dense Fine-tuning). We demonstrate that we can induce up to 75% sparsity into a 1.3B parameter GPT-3 XL model resulting in a 2.5x reduction in pre-training FLOPs, without a significant loss in accuracy on the downstream tasks relative to the dense baseline. By rigorously evaluating multiple downstream tasks, we also establish a relationship between sparsity, task complexity and dataset size. Our work presents a promising direction to train large GPT models at a fraction of the training FLOPs using weight sparsity, while retaining the benefits of pre-trained textual representations for downstream tasks.',
      keyphrases: ['UAI 2023'],
    },
    {
      heading: 'Fairness-aware class imbalanced learning on multiple subgroups',
      body: "<div><strong>Davoud Ataee Tarzanagh, Bojian Hou, Boning Tong, Qi Long, Li Shen</strong></div> We present a novel Bayesian-based optimization framework that addresses the challenge of generalization in overparameterized models when dealing with imbalanced subgroups and limited samples per subgroup. Our proposed tri-level optimization framework utilizes \textit{local} predictors, which are trained on a small amount of data, as well as a fair and class-balanced predictor at the middle and lower levels. To effectively overcome saddle points for minority classes, our lower-level formulation incorporates sharpness-aware minimization. Meanwhile, at the upper level, the framework dynamically adjusts the loss function based on validation loss, ensuring a close alignment between the \textit{global} predictor and local predictors. Theoretical analysis demonstrates the framework's ability to enhance classification and fairness generalization, potentially resulting in improvements in the generalization bound. Empirical results validate the superior performance of our tri-level framework compared to existing state-of-the-art approaches. The source code can be found at https://github.com/PennShenLab/FACIMS .",
      keyphrases: ['UAI 2023'],
    },
  ]

  return (
    <>
      <div className="form-group">
        <label htmlFor="autocomplete-input">Expertise Fine-tuning</label>
        <br />
        <div
          id="chips-container"
          style={{
            display: 'flex',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid black',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'left',
            flexWrap: 'wrap'
          }}
        >
          {keyphrases.map((keyphrase) => {
            return (
              <>
                <Chip
                  chipText={keyphrase}
                  iconEnabled={true}
                  selected={includedKeyphrases.includes(keyphrase)}
                  onClick={chipClicked}
                  onClickIcon={() => {
                    setKeyphrases(
                      keyphrases.filter((kp) => {
                        return kp !== keyphrase
                      }),
                      setIncludedKeyphrases(
                        includedKeyphrases.filter((kp) => {
                          return kp != keyphrase
                        })
                      )
                    )
                  }}
                />
              </>
            )
          })}

          <input
            type="text"
            id="autocomplete-input"
            placeholder="Add a keyphrase"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setKeyphrases([...keyphrases, e.target.value])
              }
            }}
            style={{
              width: "150px",
              margin: "5px"
            }}
          />
        </div>
      </div>
      <Collapse showLabel="Show Active Papers" hideLabel="Hide Active Papers" className={CollapseStyles.activepapers}>
        <div className="container" style={{width: "100%"}}>
          <div>
            <Accordionv2
              sections={sectionsData.filter((section) => {
                return commonElementsExist(section.keyphrases)
              })}
              options={{
                id: 'accordion-id', // Unique identifier for the accordion
                extraClasses: 'custom-class', // Extra classes to be added to the accordion container
                collapsed: true, // Whether the accordion starts collapsed or expanded
                bodyContainer: 'div', // Type of container for the section body ('div' or '')
                html: true, // Whether the body content contains HTML to be rendered directly
              }}
            />
          </div>
        </div>
      </Collapse>
      <br />
      <label>Recommended Papers:</label>
      <Accordionv2
        sections={recommendedPapers}
        options={{
          id: 'recommended-papers',
          extraClasses: 'custom-class',
          collapsed: false,
          bodyContainer: 'div',
          html: true,
        }}
      />
    </>
  )
}
