const publications = [
  {year:2026,title:'Tiny but Trusted: Efficient Vision-Language Reasoning for Time-Series Anomaly Detection',authors:'Xiaona Zhou, Muntasir Wahed, Tianjiao Yu, Constantin Brif, Ismini Lourentzou',venue:'Preprint',topics:['Time series','Vision + language'],url:'https://plan-lab.github.io/projects/VisAnom/'},
  {year:2026,title:'Hierarchical Dataset Selection for High-Quality Data Sharing',authors:'Xiaona Zhou, Yingyan Zeng, Ran Jin, Ismini Lourentzou',venue:'AAAI',oral:true,topics:['Trustworthy AI'],url:'https://plan-lab.github.io/projects/dash/'},
  {year:2026,title:'mTSBench: Benchmarking Multivariate Time Series Anomaly Detection and Model Selection at Scale',authors:'Xiaona Zhou, Constantin Brif, Ismini Lourentzou',venue:'TMLR',topics:['Time series'],url:'https://plan-lab.github.io/projects/mtsbench/'},
  {year:2025,title:'MOCHA: Are Code Language Models Robust Against Multi-Turn Malicious Coding Prompts?',authors:'Muntasir Wahed, Xiaona Zhou, Kiet A. Nguyen, Tianjiao Yu, Nirav Diwan, Gang Wang, Dilek Hakkani-Tür, Ismini Lourentzou',venue:'Findings of EMNLP',topics:['Trustworthy AI'],url:'https://aclanthology.org/2025.findings-emnlp.1249/'},
  {year:2025,title:'PurpCode: Reasoning for Safer Code Generation',authors:'Jiawei Liu, Nirav Diwan, Zhe Wang, Haoyu Zhai, Xiaona Zhou, Kiet A. Nguyen, Tianjiao Yu, Muntasir Wahed, Yinlin Deng, Hadjer Benkraouda, Yuxiang Wei, Lingming Zhang, Ismini Lourentzou, Gang Wang',venue:'NeurIPS',topics:['Trustworthy AI'],url:'https://proceedings.neurips.cc/paper_files/paper/2025/hash/4f697305ef1f868ad77c3c0027989a6f-Abstract-Conference.html'},
  {year:2025,title:'High-Quality Dataset-Sharing and Trade Based on a Performance-Oriented Directed Graph Neural Network',authors:'Yingyan Zeng, Xiaona Zhou, Premith Chilukuri, Ismini Lourentzou, Ran Jin',venue:'IEEE T-ASE',topics:['Trustworthy AI'],url:'https://doi.org/10.1109/TASE.2025.3561081'},
  {year:2024,title:'Fine-Grained Alignment for Cross-Modal Recipe Retrieval',authors:'Muntasir Wahed, Xiaona Zhou, Tianjiao Yu, Ismini Lourentzou',venue:'WACV',topics:['Vision + language'],url:'https://openaccess.thecvf.com/content/WACV2024/html/Wahed_Fine-Grained_Alignment_for_Cross-Modal_Recipe_Retrieval_WACV_2024_paper.html'}
];

function renderPublications() {
  publications.forEach((paper, index) => {
    const article = document.createElement('article');
    article.className = 'publication';
    article.innerHTML = `<h3 class="pub-title"><a href="${paper.url}" target="_blank" rel="noopener" aria-label="Open publication: ${paper.title}">${paper.title} <span aria-hidden="true">↗</span></a></h3><p class="pub-authors">${paper.authors.replace('Xiaona Zhou', '<strong>Xiaona Zhou</strong>')}</p><p class="pub-meta"><strong>${paper.venue} ${paper.year}</strong>${paper.oral ? ' · Oral presentation' : ''}</p>`;
    document.querySelector(index < 5 ? '#publication-list' : '#older-publications').append(article);
  });
}
renderPublications();
document.querySelector('#year').textContent = new Date().getFullYear();
