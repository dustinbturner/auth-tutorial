"use client";

import { useTransition } from "react";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
}   from "@/components/ui/card"

const SettingsPage = () => {
    const onClick = () => {

        settings({
            name: "New Name!"
        });
    }

    return ( 
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Button onClick={onClick}>
                    Update Name
                </Button>
            </CardContent>
        </Card>
    );
}

export default SettingsPage;
