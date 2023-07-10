import "./dashboard.css";
import graphic from "../../services/img/Group66.png";
import line from "../../services/img/Vector26.png";
import arrow from "../../services/img/Group68.png";
import circle from "../../services/img/Group81.png";
const Dashboard = () => {
  return (
    <div className="dashboard-background">
      <div className="dashboard wrapper">
        <div className="dashboard__upper">
          <div className="dashboard__graphics">
            <div className="dashboard__graphics-header">
              <div className="dashboard__title">Earnings Report</div>
              <select name="" id="">
                <option value="filter">Filter</option>
              </select>
            </div>
            <div className="dashboard__grapchics-main grapchics-main">
              <div className="grapchics-main__left-column">
                <div className="grapchics-main__earn-number">$567</div>
                <div className="grapchics-main__total-earn">
                  <img src={graphic} alt="" />
                  <span>your total earnings</span>
                </div>
                <div className="grapchics-main__footer">
                  <div className="grapchics-main__percent-line">
                    <img src={line} alt="" />

                    <div className="grapchics-main__percent">
                      <img
                        className="grapchics-main__arrow"
                        src={arrow}
                        alt=""
                      />

                      <span>12%</span>
                    </div>
                  </div>
                  <div className="grapchics-main__footer-description">
                    Update your payment method
                  </div>
                </div>
              </div>
              <div className="grapchics-main__main-graphic"></div>
            </div>
          </div>
          <div className="dashboard__middle">
            <div className="dashboard__middle-item">
              <div className="dashboard__middle-title">
                <div className="dashboard__indicator"></div>
                <div className="dashboard__indicator-description">lorem</div>
              </div>
              <div className="dashboard__statistic-number">100$</div>
              <div className="dashboard__loader"></div>
            </div>
            <div className="dashboard__middle-item">
              <div className="dashboard__middle-title">
                <div className="dashboard__indicator"></div>
                <div className="dashboard__indicator-description">lorem</div>
              </div>
              <div className="dashboard__statistic-number">100$</div>
              <div className="dashboard__loader"></div>
            </div>
            <div className="dashboard__middle-item">
              <div className="dashboard__middle-title">
                <div className="dashboard__indicator"></div>
                <div className="dashboard__indicator-description">lorem</div>
              </div>
              <div className="dashboard__statistic-number">100$</div>
              <div className="dashboard__loader"></div>
            </div>
          </div>
          <div className="dashboard__down down-section">
            <div className="down-section__nav">
              <select name="" id="">
                <option value="filterr">Filter</option>
              </select>
              <input type="text" placeholder="Search" />
              <div className="down-section__btns">
                <div className="down-section__edit-btn"></div>
                <div className="down-section__delete-btn"></div>
              </div>
            </div>
            <div className="down-section__transactions">
              <div className="down-section__trans-item">
                <div className="down-section__check-price">
                  <input type="checkbox" />
                  <span>127$</span>
                </div>
                <div className="down-section__typeOf-payment">PayPass</div>
                <div className="down-section__status">Paid</div>
                <div className="down-section__date">12 May 2023</div>
              </div>
              <div className="down-section__trans-item">
                <div className="down-section__check-price">
                  <input type="checkbox" />
                  <span>127$</span>
                </div>
                <div className="down-section__typeOf-payment">PayPass</div>
                <div className="down-section__status">Paid</div>
                <div className="down-section__date">12 May 2023</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__payment-info payment-info">
          <img src={circle} alt="" style={{ padding: "20px 0" }} />
          <div className="payment-info__text">
            <div className="payment-info__title">Lorem Ipsum</div>
            <div className="payment-info__count">456</div>
            <div className="payment-info__additional-info">
              Update your payment method
            </div>
          </div>
          <div className="payment-info__footer" style={{ padding: "20px 0" }}>
            <div className="payment-info__indicator"></div>
            <span>Lorem Ipsum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
