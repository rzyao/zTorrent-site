type Props = {
  userDays: number;
  userCount: number;
  avgSize: number;
  dormantDays: number;
  peers: number;
  age: number;
  upload: number;
  download: number;
  handleNumberChange: (
    setter: (n: number) => void,
    min: number,
    max: number
  ) => (e: any) => void;
  setUserDays: (n: number) => void;
  setUserCount: (n: number) => void;
  setAvgSize: (n: number) => void;
  setDormantDays: (n: number) => void;
  setPeers: (n: number) => void;
  setAge: (n: number) => void;
  setUpload: (n: number) => void;
  setDownload: (n: number) => void;
  view: any;
  simError: string | null;
};

export function ScenarioPanel(props: Props) {
  const {
    userDays,
    userCount,
    avgSize,
    dormantDays,
    peers,
    age,
    upload,
    download,
    handleNumberChange,
    setUserDays,
    setUserCount,
    setAvgSize,
    setDormantDays,
    setPeers,
    setAge,
    setUpload,
    setDownload,
    view,
    simError,
  } = props;

  return (
    <>
      <h2>👤 用户场景模拟 (User Scenario)</h2>
      <div className="scenario-grid">
        <div className="scenario-module">
          <h3>⏱️ 时长设置</h3>
          <div className="form-group">
            <label style={{ color: "var(--primary-color)" }}>
              做种时长 (�?
              <input
                type="number"
                value={userDays}
                onChange={handleNumberChange(setUserDays, 1, 36500)}
              />
            </label>
            <div className="info-tip">
              计算�?<span>{view.totalHours}</span> 小时的总低�?            </div>
          </div>
        </div>

        <div className="scenario-module">
          <h3>📦 存储规模</h3>
          <div className="form-group">
            <label>
              做种数量 (�?
              <input
                type="number"
                value={userCount}
                onChange={handleNumberChange(setUserCount, 1, 1000)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              种子大小 (GB)
              <input
                type="number"
                value={avgSize}
                onChange={handleNumberChange(setAvgSize, 0.1, 100)}
              />
            </label>
          </div>
          <div
            style={{
              background: "#e2e8f0",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              marginTop: "10px",
            }}
          >
            <div className="detail-row">
              <span>总体�?</span>
              <strong>{view.totalVolTB.toFixed(3)} TB</strong>
            </div>
            <div className="detail-row">
              <span>效率 f(x):</span>
              <strong style={{ color: "#059669" }}>
                {view.efficiency.toFixed(4)}
              </strong>
            </div>
          </div>
        </div>

        <div className="scenario-module">
          <h3>📊 市场因子</h3>
          <div className="form-group">
            <label>
              沉睡时间 (�?
              <input
                type="number"
                value={dormantDays}
                onChange={handleNumberChange(setDormantDays, 0, 365)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              做种人数 (�?
              <input
                type="number"
                value={peers}
                onChange={handleNumberChange(setPeers, 1, 100)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              种子年龄 (�?
              <input
                type="number"
                value={age}
                onChange={handleNumberChange(setAge, 0, 20)}
              />
            </label>
          </div>
        </div>

        <div className="scenario-module">
          <h3>📶 流量统计</h3>
          <div className="form-group">
            <label>
              上传总量 (GB)
              <input
                type="number"
                value={upload}
                onChange={handleNumberChange(setUpload, 0, 1000)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              下载总量 (GB)
              <input
                type="number"
                value={download}
                onChange={handleNumberChange(setDownload, 0, 1000)}
              />
            </label>
          </div>
        </div>
      </div>
      {simError && (
        <div
          className="info-note"
          style={{ color: "#ef4444", marginTop: "15px" }}
        >
          {simError}
        </div>
      )}
      <hr
        style={{
          border: 0,
          borderTop: "2px solid #e2e8f0",
          margin: "30px 0",
        }}
      />
    </>
  );
}
