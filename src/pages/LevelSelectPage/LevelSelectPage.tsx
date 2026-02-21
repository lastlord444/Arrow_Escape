import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLevels } from '@/content/levels/index';
import { Page } from '@/components/Page';

export function LevelSelectPage() {
    const navigate = useNavigate();
    const levels = getAllLevels();

    const handlePlay = useCallback((id: string) => {
        navigate(`/play/${id}`);
    }, [navigate]);

    return (
        <Page back={false}>
            <div style={{ padding: '20px' }}>
                <h1>Arrow Escape - Seviye Seç</h1>
                <h1>Seviyeler</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {levels.map((level) => (
                        <div
                            key={level.id}
                            onClick={() => handlePlay(level.id)}
                            style={{
                                padding: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>
                                {level.meta?.name || level.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    );
}
