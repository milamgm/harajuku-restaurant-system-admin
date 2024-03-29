import { useState, useEffect } from "react";
import { Col,  Row } from "react-bootstrap";
import BarChar from "../components/Dashboard/BarChar";
import DashboardCard from "../components/Dashboard/DashboardCard";
import LineCharC from "../components/Dashboard/LineCharC";
import { useAppContext } from "../context/AppContext";
import { getAnalytics } from "../scripts/analitics";
const Dashboard = () => {
  const { completedOrders } = useAppContext();
  const [analitics, setAnalitics] = useState({
    bestDishes: {},
    weekdays: {},
    dayHours: {},
    profit: {}
  });
  useEffect(() => {
    setAnalitics(getAnalytics(completedOrders));
  }, [completedOrders]);
  return (
    <div className=" dashboard" style={{ paddingBottom: "200px" }}>
      <div className="dashboard-card-div">
        <Row className="d-flex justify-content-center">
          <Col xs="12" sm="8" lg="6" xl="6">
          <DashboardCard title="Profit">
              <div className="card-chart-div">
                <BarChar
                  labelsQ={Object.keys(analitics.profit)}
                  dataQ={Object.values(analitics.profit)}
                  color="gold"
                />
              </div>
            </DashboardCard>
            <DashboardCard title="Peak hours">
              <div className="card-chart-div">
                <LineCharC
                  labelsQ={Object.keys(analitics.dayHours)}
                  dataQ={Object.values(analitics.dayHours)}
                  color="lightblue"
                />
              </div>
            </DashboardCard>
          </Col>
          <Col xs="12" sm="8" lg="6" xl="6">
            <DashboardCard title="Bestsellers">
              <div className="card-chart-div">
                <BarChar
                  labelsQ={Object.keys(analitics.bestDishes)}
                  dataQ={Object.values(analitics.bestDishes)}
                  color="darkred"
                />
              </div>
            </DashboardCard>
            <DashboardCard title="Weekdays">
              <div className="card-chart-div">
                <BarChar
                  labelsQ={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                  dataQ={analitics.weekdays}
                  color="blue"
                />
              </div>
            </DashboardCard>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
