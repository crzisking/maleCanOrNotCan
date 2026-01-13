import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  ClipboardList, 
  History, 
  ChevronRight, 
  ChevronLeft,
  Home,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import './index.css'; // 引入 Tailwind 样式

// --- 类型定义 ---

type ScaleType = 'IIEF-15' | 'IPSS';

interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
  dimension?: string; // IIEF 维度
}

interface AssessmentRecord {
  id: string;
  date: string;
  type: ScaleType;
  scores: Record<string, number>;
  rawAnswers: Record<number, number>;
  severity: string;
}

// --- 数据定义 ---

const IIEF15_QUESTIONS: Question[] = [
  { id: 1, dimension: 'EF', text: "在过去4周内，您进行性生活时，能够达到勃起的频率是？", options: [{ label: "无性生活", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次 (远少于一半)", value: 2 }, { label: "有时 (约占一半)", value: 3 }, { label: "大多数时候 (远多于一半)", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 2, dimension: 'EF', text: "当您受到性刺激勃起时，勃起硬度足以插入阴道的频率是？", options: [{ label: "无性生活", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 3, dimension: 'EF', text: "当您尝试性交时，能够成功插入伴侣阴道的频率是？", options: [{ label: "未尝试性交", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 4, dimension: 'EF', text: "在性交过程中，您插入后能够维持勃起的频率是？", options: [{ label: "未尝试性交", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 5, dimension: 'EF', text: "在性交过程中，维持勃起直至完成性交的困难程度是？", options: [{ label: "未尝试性交", value: 0 }, { label: "极度困难", value: 1 }, { label: "非常困难", value: 2 }, { label: "困难", value: 3 }, { label: "稍微困难", value: 4 }, { label: "不困难", value: 5 }] },
  { id: 6, dimension: 'IS', text: "您尝试过多少次性交？", options: [{ label: "无尝试", value: 0 }, { label: "1-2 次", value: 1 }, { label: "3-4 次", value: 2 }, { label: "5-6 次", value: 3 }, { label: "7-10 次", value: 4 }, { label: "11次或更多", value: 5 }] },
  { id: 7, dimension: 'IS', text: "当您尝试性交时，感到满意的频率是？", options: [{ label: "未尝试性交", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 8, dimension: 'IS', text: "您对性交的愉悦程度如何？", options: [{ label: "无性交", value: 0 }, { label: "毫无愉悦感", value: 1 }, { label: "愉悦感不强", value: 2 }, { label: "还算愉悦", value: 3 }, { label: "很愉悦", value: 4 }, { label: "极度愉悦", value: 5 }] },
  { id: 9, dimension: 'OF', text: "当您有性刺激或性交时，射精的频率是？", options: [{ label: "无性刺激/性交", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 10, dimension: 'OF', text: "当您有性刺激或性交时，有性高潮感觉的频率是？", options: [{ label: "无性刺激/性交", value: 0 }, { label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 11, dimension: 'SD', text: "您感到有性欲的频率是？", options: [{ label: "几乎从不/从不", value: 1 }, { label: "少数几次", value: 2 }, { label: "有时", value: 3 }, { label: "大多数时候", value: 4 }, { label: "几乎总是/总是", value: 5 }] },
  { id: 12, dimension: 'SD', text: "您如何评价您的性欲强度？", options: [{ label: "非常低/无", value: 1 }, { label: "低", value: 2 }, { label: "中等", value: 3 }, { label: "高", value: 4 }, { label: "非常高", value: 5 }] },
  { id: 13, dimension: 'OS', text: "您对总体性生活的满意度如何？", options: [{ label: "非常不满意", value: 1 }, { label: "不满意", value: 2 }, { label: "一般", value: 3 }, { label: "满意", value: 4 }, { label: "非常满意", value: 5 }] },
  { id: 14, dimension: 'OS', text: "您对与伴侣的性关系的满意度如何？", options: [{ label: "非常不满意", value: 1 }, { label: "不满意", value: 2 }, { label: "一般", value: 3 }, { label: "满意", value: 4 }, { label: "非常满意", value: 5 }] },
  { id: 15, dimension: 'EF', text: "您对自己能够获得并维持勃起的信心如何？", options: [{ label: "非常低", value: 1 }, { label: "低", value: 2 }, { label: "中等", value: 3 }, { label: "高", value: 4 }, { label: "非常高", value: 5 }] },
];

const IPSS_QUESTIONS: Question[] = [
  { id: 1, text: "排尿不尽感：您排尿后有未排空膀胱感觉的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 2, text: "尿频：您在排尿后不到 2 小时内又需排尿的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 3, text: "尿流中断：您排尿时出现断断续续现象的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 4, text: "尿急：您感到难以忍受尿意的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 5, text: "尿线变细：您感到尿流变细的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 6, text: "排尿费力：您需要用力才能开始排尿的频率是？", options: [{label: "完全没有", value: 0}, {label: "少于 1/5 的时间", value: 1}, {label: "少于一半时间", value: 2}, {label: "约一半时间", value: 3}, {label: "超过一半时间", value: 4}, {label: "几乎总是", value: 5}] },
  { id: 7, text: "夜尿：从入睡到早上起床，您通常需要起来排尿多少次？", options: [{label: "没有", value: 0}, {label: "1 次", value: 1}, {label: "2 次", value: 2}, {label: "3 次", value: 3}, {label: "4 次", value: 4}, {label: "5 次或更多", value: 5}] },
  { id: 8, text: "生活质量 (QoL)：如果您的余生都伴随目前的排尿状况，您的感受如何？", options: [{label: "非常高兴", value: 0}, {label: "高兴", value: 1}, {label: "大体满意", value: 2}, {label: "好坏参半", value: 3}, {label: "大体不满意", value: 4}, {label: "不高兴", value: 5}, {label: "很痛苦", value: 6}] },
];

// --- 辅助组件 ---

const RadarChart = ({ scores }: { scores: Record<string, number> }) => {
  const dimensions = [
    { key: 'EF', max: 30, label: '勃起功能' },
    { key: 'OF', max: 10, label: '高潮功能' },
    { key: 'SD', max: 10, label: '性欲' },
    { key: 'IS', max: 15, label: '性交满意度' },
    { key: 'OS', max: 10, label: '总体满意度' },
  ];

  // 调整尺寸以适应小屏幕，防止标签被切断
  const size = 280; 
  const center = size / 2;
  const radius = 80; 
  
  const getCoordinates = (value: number, max: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      lx: center + (radius + 24) * Math.cos(angle), 
      ly: center + (radius + 24) * Math.sin(angle), 
    };
  };

  const points = dimensions.map((d, i) => {
    const score = scores[d.key] || 0;
    const coords = getCoordinates(score, d.max, i, dimensions.length);
    return { ...coords, score, label: d.label };
  });

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const levels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="w-full flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景网格 */}
        {levels.map((level, i) => (
          <circle 
            key={i} 
            cx={center} 
            cy={center} 
            r={radius * level} 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="1" 
          />
        ))}
        
        {/* 轴线 */}
        {points.map((p, i) => (
          <line 
            key={i} 
            x1={center} 
            y1={center} 
            x2={center + radius * Math.cos((Math.PI * 2 * i) / points.length - Math.PI / 2)} 
            y2={center + radius * Math.sin((Math.PI * 2 * i) / points.length - Math.PI / 2)} 
            stroke="#cbd5e1" 
            strokeWidth="1" 
          />
        ))}

        {/* 数据区域 */}
        <polygon points={polyPoints} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
        
        {/* 数据点 */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
        ))}

        {/* 标签 */}
        {points.map((p, i) => (
          <text 
            key={i} 
            x={p.lx} 
            y={p.ly} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-[10px] fill-slate-500 font-medium tracking-tighter"
          >
            {p.label}
          </text>
        ))}
        
        {/* 分数标注 */}
         {points.map((p, i) => (
          <text 
            key={`s-${i}`} 
            x={p.lx} 
            y={p.ly + 10} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-[9px] fill-blue-600 font-bold"
          >
            {p.score}分
          </text>
        ))}
      </svg>
    </div>
  );
};

// --- 应用主逻辑 ---

const App = () => {
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');
  const [activeScreen, setActiveScreen] = useState<'main' | 'assessment' | 'result'>('main');
  const [activeScale, setActiveScale] = useState<ScaleType>('IIEF-15');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [historyList, setHistoryList] = useState<AssessmentRecord[]>([]);
  const [currentResult, setCurrentResult] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sh_history');
    if (saved) {
      setHistoryList(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (record: AssessmentRecord) => {
    const updated = [record, ...historyList];
    setHistoryList(updated);
    localStorage.setItem('sh_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if(confirm('确定要清除所有历史记录吗？')) {
      localStorage.removeItem('sh_history');
      setHistoryList([]);
    }
  };

  const startAssessment = (scale: ScaleType) => {
    setActiveScale(scale);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setActiveScreen('assessment');
  };

  const handleAnswer = (value: number) => {
    const currentQuestions = activeScale === 'IIEF-15' ? IIEF15_QUESTIONS : IPSS_QUESTIONS;
    const qId = currentQuestions[currentQuestionIndex].id;
    
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const calculateIIEF = (raw: Record<number, number>) => {
    const getSum = (ids: number[]) => ids.reduce((acc, id) => acc + (raw[id] || 0), 0);

    const EF = getSum([1, 2, 3, 4, 5, 15]);
    const OF = getSum([9, 10]);
    const SD = getSum([11, 12]);
    const IS = getSum([6, 7, 8]);
    const OS = getSum([13, 14]);

    let severity = "无功能障碍";
    if (EF <= 10) severity = "重度障碍";
    else if (EF <= 16) severity = "中度障碍";
    else if (EF <= 21) severity = "轻中度障碍";
    else if (EF <= 25) severity = "轻度障碍";

    return { scores: { EF, OF, SD, IS, OS }, severity };
  };

  const calculateIPSS = (raw: Record<number, number>) => {
    let symptomScore = 0;
    for (let i = 1; i <= 7; i++) symptomScore += (raw[i] || 0);
    const qol = raw[8] || 0;

    let severity = "轻度症状";
    if (symptomScore >= 20) severity = "重度症状";
    else if (symptomScore >= 8) severity = "中度症状";

    return { scores: { Symptom: symptomScore, QoL: qol }, severity };
  };

  const finishAssessment = (finalAnswers: Record<number, number>) => {
    let resultData;
    if (activeScale === 'IIEF-15') {
      resultData = calculateIIEF(finalAnswers);
    } else {
      resultData = calculateIPSS(finalAnswers);
    }

    const record: AssessmentRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: activeScale,
      rawAnswers: finalAnswers,
      ...resultData
    };

    setCurrentResult(record);
    saveHistory(record);
    setActiveScreen('result');
  };

  // --- 界面渲染 ---

  // 1. 仪表盘 (首页)
  const renderDashboard = () => {
    const lastIIEF = historyList.find(h => h.type === 'IIEF-15');
    
    return (
      <div className="space-y-6 pb-24 fade-in">
        {/* 欢迎/状态卡片 */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 mx-4 mt-6 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
          <h2 className="text-sm font-medium opacity-80 mb-1">行不行</h2>
          
          {lastIIEF ? (
            <div className="flex items-end justify-between mt-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{lastIIEF.scores.EF}</span>
                  <span className="text-lg opacity-70">/30</span>
                </div>
                <div className="text-sm opacity-90 mt-1 font-medium">IIEF-15 勃起功能指数</div>
              </div>
              <div className="text-right pb-1">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
                  {lastIIEF.severity}
                </div>
                <div className="text-[10px] opacity-60 mt-2">上次测评: {new Date(lastIIEF.date).toLocaleDateString()}</div>
              </div>
            </div>
          ) : (
             <div className="mt-4">
                <h1 className="text-2xl font-bold mb-2">欢迎使用</h1>
                <p className="opacity-80 text-sm leading-relaxed">请选择下方的临床量表开始您的第一次专业评估。</p>
            </div>
          )}
        </div>

        {/* 测评入口 */}
        <div className="px-5">
          <h3 className="font-bold text-slate-800 text-lg mb-4">开始测评</h3>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => startAssessment('IIEF-15')}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Activity size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-lg">IIEF-15</div>
                  <div className="text-xs text-slate-500 mt-0.5">国际勃起功能指数 (金标准)</div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-active:text-blue-500" size={20} />
            </button>

            <button 
              onClick={() => startAssessment('IPSS')}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                  <ClipboardList size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-lg">IPSS</div>
                  <div className="text-xs text-slate-500 mt-0.5">国际前列腺症状评分</div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-active:text-teal-500" size={20} />
            </button>
          </div>
        </div>

        {/* 最近趋势图表 (如果有数据) */}
        {lastIIEF && (
          <div className="px-5">
            <h3 className="font-bold text-slate-800 text-lg mb-4">健康轮廓</h3>
            <div className="bg-white pt-6 pb-2 px-4 rounded-2xl shadow-sm border border-slate-100">
              <RadarChart scores={lastIIEF.scores} />
            </div>
          </div>
        )}

        {/* 免责声明 */}
        <div className="px-5 mt-8">
          <div className="flex gap-2 items-start bg-slate-100 p-3 rounded-xl text-xs text-slate-500 leading-relaxed">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <p>本应用数据仅供参考，不具备医疗诊断作用。如有健康问题，请务必及时前往正规医院就医。</p>
          </div>
        </div>
      </div>
    );
  };

  // 2. 历史记录页面
  const renderHistory = () => (
    <div className="pb-24 pt-6 px-5 fade-in min-h-screen bg-slate-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">测评历史</h2>
        {historyList.length > 0 && (
          <button 
            onClick={clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {historyList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <History size={48} className="mb-4 opacity-20" />
            <p className="text-sm">暂无历史记录</p>
          </div>
        )}
        {historyList.map(record => (
          <div 
            key={record.id} 
            onClick={() => { setCurrentResult(record); setActiveScreen('result'); }}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-1.5 h-10 rounded-full ${
                record.type === 'IIEF-15' ? 'bg-blue-500' : 'bg-teal-500'
              }`}></div>
              <div>
                <div className="font-bold text-slate-800 text-base">{record.type === 'IIEF-15' ? '勃起功能量表' : '前列腺评分'}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800 text-xl">
                {record.type === 'IIEF-15' ? record.scores.EF : record.scores.Symptom}
                <span className="text-xs text-slate-400 font-normal ml-0.5">分</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{record.severity.split(' ')[0]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. 测评过程 (全屏)
  const renderAssessmentScreen = () => {
    const questions = activeScale === 'IIEF-15' ? IIEF15_QUESTIONS : IPSS_QUESTIONS;
    const currentQ = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col fade-in relative z-50">
        {/* 顶部导航 */}
        <div className="bg-white px-4 h-14 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <button onClick={() => setActiveScreen('main')} className="p-2 -ml-2 text-slate-500 font-medium text-sm">
            取消
          </button>
          <div className="font-bold text-slate-800 text-base">{activeScale === 'IIEF-15' ? 'IIEF-15 测评' : 'IPSS 测评'}</div>
          <div className="w-8"></div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-slate-200 h-1">
          <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {/* 问题区域 */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="text-xs font-bold text-blue-600 mb-3 tracking-wide uppercase">Question {currentQuestionIndex + 1} / {questions.length}</div>
          <h2 className="text-xl font-bold text-slate-900 mb-8 leading-snug">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left p-4 rounded-xl bg-white border border-slate-200 shadow-sm active:border-blue-500 active:bg-blue-50 active:scale-[0.99] transition-all"
              >
                <span className="font-medium text-slate-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 4. 结果详情 (全屏)
  const renderResultScreen = () => {
    if (!currentResult) return null;

    const isIIEF = currentResult.type === 'IIEF-15';
    const mainScore = isIIEF ? currentResult.scores.EF : currentResult.scores.Symptom;
    const maxScore = isIIEF ? 30 : 35;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col fade-in relative z-50">
        {/* 顶部导航 */}
        <div className="bg-white px-4 h-14 flex items-center shadow-sm sticky top-0 z-20">
          <button onClick={() => setActiveScreen('main')} className="p-2 -ml-2 text-slate-600 flex items-center gap-1 active:opacity-70">
            <ChevronLeft size={22} />
            <span className="font-medium">返回</span>
          </button>
          <div className="font-bold text-slate-800 ml-2">测评报告</div>
        </div>

        <div className="p-5 pb-8 overflow-y-auto space-y-5">
          {/* 总分卡片 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="text-sm text-slate-500 font-medium mb-4 uppercase tracking-wide">
              {isIIEF ? '勃起功能指数 (EF)' : '总症状评分'}
            </div>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle 
                  cx="50%" cy="50%" r="70" 
                  stroke={mainScore > (maxScore * 0.8) ? "#22c55e" : mainScore > (maxScore * 0.5) ? "#eab308" : "#ef4444"} 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * mainScore) / maxScore} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold text-slate-800">{mainScore}</span>
                <span className="text-sm text-slate-400 font-medium mt-1">/ {maxScore}</span>
              </div>
            </div>

            <div className={`mt-6 px-6 py-2 rounded-full text-sm font-bold shadow-sm ${
              currentResult.severity.includes('无') || currentResult.severity.includes('轻度症状') 
                ? 'bg-green-100 text-green-700' 
                : currentResult.severity.includes('中度') 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {currentResult.severity}
            </div>
          </div>

          {/* 维度详情 (仅 IIEF) */}
          {isIIEF && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6 text-lg">维度分析</h3>
              <div className="mb-8">
                 <RadarChart scores={currentResult.scores} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-500 mb-1">高潮功能</div>
                  <div className="font-bold text-xl text-slate-800">{currentResult.scores.OF}/10</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-500 mb-1">性欲</div>
                  <div className="font-bold text-xl text-slate-800">{currentResult.scores.SD}/10</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-500 mb-1">性交满意度</div>
                  <div className="font-bold text-xl text-slate-800">{currentResult.scores.IS}/15</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-500 mb-1">总体满意度</div>
                  <div className="font-bold text-xl text-slate-800">{currentResult.scores.OS}/10</div>
                </div>
              </div>
            </div>
          )}

          {/* 结果页免责声明 */}
          <div className="mt-6 bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 text-orange-800">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold block mb-1">免责声明</span>
              本测评结果仅基于您的主观反馈生成，完全不具备医疗效力。请勿仅依据此结果进行自我诊断或用药。如有身体不适，请咨询专业医生。
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 主渲染入口 ---

  if (activeScreen === 'assessment') return renderAssessmentScreen();
  if (activeScreen === 'result') return renderResultScreen();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 select-none">
      {/* 仅在主视图显示头部 */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-10 px-4 h-14 flex items-center justify-center border-b border-slate-200/50 shadow-sm">
        <h1 className="font-bold text-lg text-slate-800">行不行</h1>
      </header>

      {/* 内容区域 */}
      <main className="max-w-lg mx-auto w-full">
        {view === 'dashboard' && renderDashboard()}
        {view === 'history' && renderHistory()}
      </main>

      {/* 底部导航栏 (极简风格) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around pb-1 z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home size={26} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">主页</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'history' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History size={26} strokeWidth={view === 'history' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">历史</span>
        </button>
      </nav>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
