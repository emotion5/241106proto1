function BoardGenerator({positionX, positionY, positionZ, rotationX, rotationY, rotationZ, width, height, depth}) {
    return (
        <mesh position={[positionX, positionY, positionZ]} rotation={[rotationX * Math.PI / 180, rotationY * Math.PI / 180, rotationZ * Math.PI / 180]} scale={[width, height, depth]}>
            <boxGeometry/>
            <meshStandardMaterial color="red" />
        </mesh>
    )
}

export default BoardGenerator;