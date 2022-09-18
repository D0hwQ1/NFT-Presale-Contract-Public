import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../components/layout";
import SEO from "../components/seo";

import { setKaikas } from "../klaytn/setKaikas";

import Header from "../components/Header";
import Timer from "../components/Timer";

const IndexPage = () => {
    const { account, klaytn, active, activate } = setKaikas();

    const ColoredLine = ({ color }: any) => (
        <div style={{ position: "absolute", width: "100vw", height: "100vh" }}>
            <h3
                style={{
                    zIndex: "-100",
                    position: "absolute",
                    width: "90vw",
                    height: "8vh",
                    marginTop: "92vh",
                    color: "black",
                    backgroundColor: color,
                    fontSize: "0.8vw",
                    paddingLeft: "10vw",
                    lineHeight: "8vh",
                }}
            >
                @ slimefarm, 2022. All rights reserved
            </h3>
        </div>
    );

    useEffect(() => {
        activate();

        if (klaytn) {
            if (klaytn.networkVersion.toString() != 8217) {
                toast.error(`Wrong network! Please select to Cypress Mainnet`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            klaytn.on("accountsChanged", () => {
                activate();
            });
            klaytn.on("networkChanged", () => {
                if (klaytn.networkVersion.toString() != 8217) {
                    toast.error(`Wrong network! Please select to Cypress Testnet`, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                if (active) {
                    activate();
                }
            });
        } else {
            toast.error("Please install Klaytn Wallet", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [account]);

    return (
        <Layout>
            <SEO title="Minting" />
            <ToastContainer />
            <div className="default">
                <ColoredLine color="#61C1C7"></ColoredLine>
                <Header account={active}></Header>
                <Timer account={account}></Timer>
            </div>
        </Layout>
    );
};

export default IndexPage;
