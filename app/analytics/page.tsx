"use client";
import { useAnalyticsApi } from "@/lib/requests";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-splash";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register all necessary Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Define interfaces for data structure
interface YearlyData {
  postsThisYear: number;
  commentsThisYear: number;
  likesThisYear: number;
  usersJoinedThisYear: number;
}

interface MonthlyData {
  month: string;
  posts: number;
  comments: number;
  likes: number;
  usersJoined: number;
}

interface AnalyticsData {
  yearly: YearlyData;
  monthly: MonthlyData[];
}

interface AnalyticsResponse {
  message: string;
  status: number;
  data: AnalyticsData;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await useAnalyticsApi.getAnalytics();
        if (response.status === 200) {
          setAnalyticsData(response.data);
        } else {
          console.log(response);
          setError("Failed to fetch analytics data.");
        }
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    if (!analyticsData && loading) {
      // Only fetch if data is not present and still loading
      fetchData();
    }
  }, [analyticsData, loading]); // Depend on analyticsData and loading state

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="md:ml-[300px] mx-auto p-6 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="md:ml-[300px] mx-auto p-6 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">No Analytics Data Available</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  // Destructure yearly and monthly data for easier access
  const { yearly, monthly } = analyticsData;

  // --- Data for Yearly Distribution Doughnut Chart ---
  const yearlyDistributionData = {
    labels: ["Posts", "Comments", "Likes", "Users Joined"],
    datasets: [
      {
        label: "Count",
        data: [
          yearly.postsThisYear,
          yearly.commentsThisYear,
          yearly.likesThisYear,
          yearly.usersJoinedThisYear,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red for Posts
          "rgba(54, 162, 235, 0.6)", // Blue for Comments
          "rgba(255, 206, 86, 0.6)", // Yellow for Likes
          "rgba(75, 192, 192, 0.6)", // Green for Users Joined
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const yearlyDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Yearly Activity Distribution",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw;
            const total = context.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(2) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // --- Data for Monthly Bar Charts ---
  const monthLabels = monthly.map((data) => data.month);

  const createMonthlyChartData = (
    label: string,
    dataKey: keyof MonthlyData,
    color: string
  ) => ({
    labels: monthLabels,
    datasets: [
      {
        label: label,
        data: monthly.map((data) => data[dataKey]),
        backgroundColor: color,
        borderColor: color.replace("0.6", "1"),
        borderWidth: 1,
      },
    ],
  });

  const monthlyChartOptions = (titleText: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: titleText,
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  });

  const postsMonthlyData = createMonthlyChartData(
    "Posts",
    "posts",
    "rgba(255, 99, 132, 0.6)"
  );
  const commentsMonthlyData = createMonthlyChartData(
    "Comments",
    "comments",
    "rgba(54, 162, 235, 0.6)"
  );
  const likesMonthlyData = createMonthlyChartData(
    "Likes",
    "likes",
    "rgba(255, 206, 86, 0.6)"
  );
  const usersJoinedMonthlyData = createMonthlyChartData(
    "Users Joined",
    "usersJoined",
    "rgba(75, 192, 192, 0.6)"
  );

  return (
    <div className="md:ml-[300px] mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8 text-center">
        TripOtter Analytics
      </h1>

      {/* Yearly Summary Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Yearly Overview ({new Date().getFullYear()})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm font-semibold opacity-80 mb-2">Total Posts</p>
            <p className="text-4xl font-bold">{yearly.postsThisYear}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm font-semibold opacity-80 mb-2">
              Total Comments
            </p>
            <p className="text-4xl font-bold">{yearly.commentsThisYear}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm font-semibold opacity-80 mb-2">Total Likes</p>
            <p className="text-4xl font-bold">{yearly.likesThisYear}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm font-semibold opacity-80 mb-2">
              New Users Joined
            </p>
            <p className="text-4xl font-bold">{yearly.usersJoinedThisYear}</p>
          </div>
        </div>
      </section>

      {/* Yearly Distribution Chart */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <div className="max-w-md mx-auto">
          {" "}
          {/* Constrain width for Doughnut */}
          <Doughnut
            data={yearlyDistributionData}
            options={yearlyDistributionOptions}
          />
        </div>
      </section>

      {/* Monthly Trends Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Monthly Trends ({new Date().getFullYear()})
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts Monthly Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
            <Bar
              data={postsMonthlyData}
              options={monthlyChartOptions("Monthly Posts")}
            />
          </div>

          {/* Comments Monthly Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
            <Bar
              data={commentsMonthlyData}
              options={monthlyChartOptions("Monthly Comments")}
            />
          </div>

          {/* Likes Monthly Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
            <Bar
              data={likesMonthlyData}
              options={monthlyChartOptions("Monthly Likes")}
            />
          </div>

          {/* Users Joined Monthly Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
            <Bar
              data={usersJoinedMonthlyData}
              options={monthlyChartOptions("Monthly Users Joined")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
