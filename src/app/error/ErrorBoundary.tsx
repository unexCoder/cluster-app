'use client'

import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Rendering Error</h2>
                    <p>Unable to load 3D visualization</p>
                </div>
            );
        }

        return this.props.children;
    }
}